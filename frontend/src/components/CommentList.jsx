import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './Comment';
import '../styles/CommentList.css';

const CommentList = ({ postId, currentUserProfile }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProfiles, setUserProfiles] = useState({});

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

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post('http://localhost:9090/api/comments', {
                postId,
                userId: currentUserProfile.sub,
                content: newComment
            }, {
                withCredentials: true
            });

            setComments([...comments, response.data]);
            setNewComment('');
        } catch (err) {
            setError('Failed to add comment');
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
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-input"
                />
                <button type="submit" className="comment-submit">
                    <i className="fas fa-paper-plane"></i>
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