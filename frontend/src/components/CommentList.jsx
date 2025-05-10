import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './Comment';
import { toast } from 'react-toastify';
import '../styles/CommentList.css';

const filterBadWords = (text) => {
    // Common bad words list - you can expand this
    const badWords = [
        'fuck', 'shit', 'ass', 'bitch', 'dick','sucks' 
        
    ];
    
    let filteredText = text;
    badWords.forEach(word => {
        // Updated regex to match whole words only
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filteredText = filteredText.replace(regex, (match) => {
            return match.charAt(0) + '*'.repeat(match.length - 1);
        });
    });
    
    return filteredText;
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
        for (let i = 0; i < retries; i++) {
            try {
                const API_KEY = import.meta.env.VITE_PERSPECTIVE_API_KEY;
                
                // Use the correct API endpoint
                const response = await axios({
                    method: 'post',
                    url: `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze`,
                    params: {
                        key: API_KEY
                    },
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

                // Extract scores from response
                const scores = {
                    toxicity: response.data.attributeScores.TOXICITY.summaryScore.value,
                    severeToxicity: response.data.attributeScores.SEVERE_TOXICITY.summaryScore.value,
                    profanity: response.data.attributeScores.PROFANITY.summaryScore.value,
                    threat: response.data.attributeScores.THREAT.summaryScore.value,
                    insult: response.data.attributeScores.INSULT.summaryScore.value
                };

                if (scores.toxicity > 0.7 || 
                    scores.severeToxicity > 0.5 || 
                    scores.profanity > 0.8 || 
                    scores.threat > 0.5 || 
                    scores.insult > 0.7) {
                    return {
                        isInappropriate: true,
                        reason: 'This comment may contain inappropriate content.'
                    };
                }

                return { isInappropriate: false };

            } catch (error) {
                console.error('Perspective API Error:', error);
                
                // If it's the last retry, check if it's an auth error
                if (i === retries - 1) {
                    if (error.response?.status === 403) {
                        console.error('API Key authentication failed. Please verify your API key.');
                        return { isInappropriate: false }; // Fail open if API is unavailable
                    }
                    throw error;
                }
                
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 10000)));
                continue;
            }
        }
        return { isInappropriate: false }; // Default fallback
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsAnalyzing(true);

            // First filter the bad words
            const filteredComment = filterBadWords(newComment);

            // Then check toxicity
            const analysis = await analyzeToxicity(filteredComment);
            
            if (analysis.isInappropriate) {
                toast.error(analysis.reason);
                setIsAnalyzing(false);
                return;
            }

            const response = await axios.post('http://localhost:9090/api/comments', {
                postId,
                userId: currentUserProfile.sub,
                content: filteredComment  // Use the filtered version
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