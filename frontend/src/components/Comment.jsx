import React, { useState } from 'react';
import axios from 'axios';
import './Comment.css';

const Comment = ({ comment, currentUserId, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

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

    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comment">
            <div className="comment-header">
                <img
                    src={`https://ui-avatars.com/api/?name=${comment.userId}&size=32`}
                    alt="User avatar"
                    className="comment-avatar"
                />
                <div className="comment-info">
                    <span className="comment-author">User {comment.userId}</span>
                    <span className="comment-time">{formatTimestamp(comment.createdAt)}</span>
                </div>
                {currentUserId === comment.userId && (
                    <div className="comment-actions">
                        <button onClick={() => setIsEditing(!isEditing)} className="comment-action-btn">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => onDelete(comment.id)} className="comment-action-btn">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                )}
            </div>
            <div className="comment-content">
                {isEditing ? (
                    <div className="comment-edit">
                        <input
                            type="text"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="comment-edit-input"
                        />
                        <div className="comment-edit-actions">
                            <button onClick={handleEdit} className="comment-save-btn">
                                Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="comment-cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>{comment.content}</p>
                )}
            </div>
        </div>
    );
};

export default Comment;