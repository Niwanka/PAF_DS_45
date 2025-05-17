import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/comment.css';

const Comment = ({ comment, currentUserId, onDelete, userProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showOptions, setShowOptions] = useState(false);

    const handleEdit = async () => {
        try {
            await axios.put(`http://localhost:9090/api/comments/${comment.id}`, {
                content: editedContent
            }, {
                withCredentials: true
            });
            setIsEditing(false);
            comment.content = editedContent;
            toast.success('Comment updated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } catch (err) {
            toast.error('Failed to update comment', {
                position: "top-right",
                autoClose: 3000
            });
        }
    };

    const handleDelete = async () => {
        // Show confirmation toast
        toast.warn(
            <div>
                Are you sure you want to delete this comment?
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <button
                        onClick={() => confirmDelete()}
                        style={{
                            marginRight: '10px',
                            padding: '5px 10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        style={{
                            padding: '5px 10px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        );
    };

    const confirmDelete = async () => {
        try {
            await onDelete(comment.id);
            toast.dismiss(); // First dismiss any existing toasts
            const toastId = toast.success('Comment deleted successfully!', {
                position: "top-right",
                autoClose: 3000, // Will auto close after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (err) {
            console.error('Failed to delete comment:', err);
            toast.dismiss();
            toast.error('Failed to delete comment', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - commentDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return commentDate.toLocaleDateString();
    };

    const getDefaultAvatar = (name = 'User') => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    };

    const getUserFullName = () => {
        if (userProfile?.firstName && userProfile?.lastName) {
            return `${userProfile.firstName} ${userProfile.lastName}`;
        }
        return 'Anonymous User';
    };

    return (
        <div className="comment" onMouseEnter={() => setShowOptions(true)} onMouseLeave={() => setShowOptions(false)}>
            <img
                src={userProfile?.picture || getDefaultAvatar(getUserFullName())}
                alt={`${getUserFullName()}'s avatar`}
                className="comment-avatar"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDefaultAvatar(getUserFullName());
                }}
            />
            <div className="comment-content-wrapper">
                {isEditing ? (
                    <form className="comment-edit-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit();
                    }}>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="comment-edit-input"
                            autoFocus
                        />
                        <div className="comment-edit-actions">
                            <button type="submit" className="comment-edit-btn comment-save-btn">
                                <i className="fas fa-check"></i> Save
                            </button>
                            <button 
                                type="button" 
                                className="comment-edit-btn comment-cancel-btn"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(comment.content);
                                }}
                            >
                                <i className="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="comment-header">
                            <div className="comment-author-info">
                                <span className="comment-author">
                                    {getUserFullName()}
                                </span>
                                <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            {currentUserId === comment.userId && showOptions && (
                                <div className="comment-actions">
                                    <button 
                                        className="comment-action-btn"
                                        onClick={() => setIsEditing(true)}
                                        title="Edit comment"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        className="comment-action-btn delete"
                                        onClick={handleDelete}
                                        title="Delete comment"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="comment-text">{comment.content}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Comment;