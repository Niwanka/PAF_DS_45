import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './Comment';
import { toast } from 'react-toastify';
import '../styles/CommentList.css';

// Enhanced bad words list and filtering function
const filterBadWords = (text) => {
    // Expanded bad words list
    const badWords = [
        'fuck', 'shit', 'ass', 'bitch', 'dick', 'sucks',
        'damn', 'hell', 'crap', 'piss', 'whore', 'slut',
        'bastard', 'cunt', 'pussy', 'cock', 'nigga', 'nigger',
        'faggot', 'retard', 'hitler', 'nazi', 'penis', 'vagina',
        // Add more words as needed
    ];
    
    const patterns = {
        // Detect repetitive characters (e.g., "f***k")
        repetitive: /(.)\1{2,}/g,
        // Detect common letter substitutions (e.g., "f@ck", "sh1t")
        substitutions: /[@ $#*!0-9]/g,
        // Detect spaces between letters (e.g., "f u c k")
        spaced: /\b\w\s+\w\s+\w\b/g
    };

    let filteredText = text.toLowerCase();

    // Remove common letter substitutions
    filteredText = filteredText.replace(patterns.substitutions, '');
    
    // Check for spaced out words
    const spacedOutWords = filteredText.match(patterns.spaced);
    if (spacedOutWords) {
        spacedOutWords.forEach(word => {
            const compact = word.replace(/\s+/g, '');
            if (badWords.includes(compact)) {
                text = text.replace(word, '*'.repeat(word.length));
            }
        });
    }

    // Filter bad words
    badWords.forEach(word => {
        // Match whole words only with case insensitivity
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        text = text.replace(regex, '*'.repeat(word.length));
        
        // Also check for partially obscured versions (e.g., "f*ck", "sh*t")
        const partialRegex = new RegExp(
            word.split('').join('[^a-zA-Z]*'),
            'gi'
        );
        text = text.replace(partialRegex, '*'.repeat(word.length));
    });

    return text;
};

const CommentList = ({ postId, currentUserProfile }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfiles, setUserProfiles] = useState({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    useEffect(() => {
        const fetchUserProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:9090/api/profile/all', {
                    withCredentials: true
                });
                
                // Create a map of userId to profile
                const profileMap = {};
                response.data.forEach(profile => {
                    if (profile.sub) {
                        profileMap[profile.sub] = profile;
                    }
                });
                setUserProfiles(profileMap);
            } catch (err) {
                console.error('Error fetching user profiles:', err);
            }
        };

        fetchUserProfiles();
    }, [comments]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:9090/api/comments/post/${postId}`, {
                withCredentials: true
            });
            setComments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load comments');
            setLoading(false);
        }
    };

    const analyzeToxicity = async (text, retries = 3) => {
        const API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;

        try {
            const response = await axios({
                method: 'post',
                url: `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    comment: { text },
                    languages: ['en'],
                    requestedAttributes: {
                        TOXICITY: {},
                        SEVERE_TOXICITY: {},
                        PROFANITY: {},
                        THREAT: {},
                        INSULT: {}
                    }
                }
            });

            console.log('Raw API Response:', response.data);

            // Extract the toxicity score from the actual response structure
            const scores = {
                TOXICITY: response.data.attributeScores?.TOXICITY?.summaryScore?.value || 0,
                SEVERE_TOXICITY: response.data.attributeScores?.SEVERE_TOXICITY?.summaryScore?.value || 0,
                PROFANITY: response.data.attributeScores?.PROFANITY?.summaryScore?.value || 0,
                THREAT: response.data.attributeScores?.THREAT?.summaryScore?.value || 0,
                INSULT: response.data.attributeScores?.INSULT?.summaryScore?.value || 0
            };

            console.log('Extracted scores:', scores);

            const toxicityThresholds = {
                TOXICITY: 0.6,
                SEVERE_TOXICITY: 0.4,
                PROFANITY: 0.6,
                THREAT: 0.4,
                INSULT: 0.5
            };

            // Check if the toxicity score exceeds our threshold
            const isInappropriate = scores.TOXICITY > toxicityThresholds.TOXICITY;

            return {
                isInappropriate,
                reason: isInappropriate 
                    ? `This comment contains inappropriate content (Toxicity: ${(scores.TOXICITY * 100).toFixed(1)}%)`
                    : null,
                scores
            };

        } catch (error) {
            console.error('Perspective API Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 403) {
                toast.error('API authentication failed. Please check your API key.');
                return { isInappropriate: false };
            }
            
            if (retries > 1) {
                // Wait before retrying with exponential backoff
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries - 1)));
                return analyzeToxicity(text, retries - 1);
            }
            
            toast.warn('Content moderation service is temporarily unavailable. Using basic filtering only.');
            return { isInappropriate: false };
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsAnalyzing(true);

            // Length check
            if (newComment.length > 1000) {
                toast.error('Comment is too long. Maximum length is 1000 characters.');
                return;
            }

            // Initial bad word filtering
            const filteredComment = filterBadWords(newComment);

            // Check if comment was heavily filtered
            const filterRatio = (newComment.length - filteredComment.replace(/\*/g, '').length) / newComment.length;
            if (filterRatio > 0.3) {
                toast.error('Comment contains too many inappropriate words.');
                setIsAnalyzing(false);
                return;
            }

            // Perspective API check
            const analysis = await analyzeToxicity(filteredComment);
            
            if (analysis.isInappropriate) {
                toast.error(analysis.reason);
                setIsAnalyzing(false);
                return;
            }

            // Proceed with posting the filtered comment
            const response = await axios.post('http://localhost:9090/api/comments', {
                postId,
                userId: currentUserProfile.sub,
                content: filteredComment
            }, {
                withCredentials: true
            });

            setComments([...comments, response.data]);
            setNewComment('');
            toast.success('Comment posted successfully');

        } catch (err) {
            toast.error('Failed to add comment');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:9090/api/comments/${commentId}`, {
                withCredentials: true
            });
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (err) {
            setError('Failed to delete comment');
        }
    };

    if (loading) return <div className="comments-loading">Loading comments...</div>;
    if (error) return <div className="comments-error">{error}</div>;

    return (
        <div className="comments-section">
            <form onSubmit={handleAddComment} className="comment-form">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => {
                        const filtered = filterBadWords(e.target.value);
                        setNewComment(filtered);
                    }}
                    placeholder="Write a comment..."
                    className="comment-input"
                    disabled={isAnalyzing}
                />
                <button 
                    type="submit" 
                    className="comment-submit"
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <i className="fas fa-paper-plane"></i>
                    )}
                </button>
            </form>
            <div className="comments-list">
                {comments.map(comment => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUserProfile.sub}
                        onDelete={handleDeleteComment}
                        userProfile={userProfiles[comment.userId]}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentList;