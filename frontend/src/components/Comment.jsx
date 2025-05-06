import React, { useState } from 'react';
import './comment.css';

const Comment = ({ comment, currentUserId, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);

    const handleEdit = async () => {
        try {
            await axios.put(`http://localhost:9090/api/comments/${comment.id}`, {
                content: editedContent
            }, {
                withCredentials: true
            });
            setIsEditing(false);
            comment.content = editedContent;
        } catch (err) {
            console.error('Failed to update comment:', err);
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const commentDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - commentDate) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return commentDate.toLocaleDateString();
    };

    return (
        <div className="comment">
            <img
                src={comment.authorPicture || `https://ui-avatars.com/api/?name=${comment.userId}&size=32`}
                alt="User avatar"
                className="comment-avatar"
            />
            <div className="comment-content-wrapper">
                {isEditing ? (
                    <form className="comment-edit-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit();
                    }}>
                        <input
                            type="text"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="comment-edit-input"
                        />
                        <div className="comment-edit-actions">
                            <button type="submit" className="comment-edit-btn comment-save-btn">
                                Save
                            </button>
                            <button 
                                type="button" 
                                className="comment-edit-btn comment-cancel-btn"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="comment-header">
                            <span className="comment-author">User {comment.userId}</span>
                            <span className="comment-time">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                        <div className="comment-actions">
                            <button className="comment-action-link">Like</button>
                            <button className="comment-action-link">Reply</button>
                        </div>
                    </>
                )}
            </div>
            
            {currentUserId === comment.userId && (
                <div className="comment-menu">
                    <button 
                        className="comment-menu-btn"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <i className="fas fa-ellipsis-h"></i>
                    </button>
                    {showMenu && (
                        <div className="comment-menu-dropdown">
                            <button onClick={() => setIsEditing(true)}>
                                <i className="fas fa-edit"></i> Edit
                            </button>
                            <button onClick={() => onDelete(comment.id)}>
                                <i className="fas fa-trash-alt"></i> Delete
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Comment;