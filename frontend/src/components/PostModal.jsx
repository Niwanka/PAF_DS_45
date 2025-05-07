import React from 'react';
import PostForm from './PostForm';
import './PostModal.css';

const PostModal = ({
  isOpen,
  onClose,
  userId,
  post,
  isEditing,
  onPostCreated,
  onPostUpdated,
  onPostDeleted
}) => {
  if (!isOpen) return null;

  const handleSuccess = (action, updatedPost) => {
    if (action === 'deleted' && onPostDeleted) {
      onPostDeleted(post._id);
    } else if (action === 'updated' && onPostUpdated) {
      onPostUpdated(updatedPost);
    } else if (action === 'created' && onPostCreated) {
      onPostCreated(updatedPost);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit post' : 'Create a post'}</h2>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-content">
          <PostForm
            userId={userId}
            post={post}
            isEditing={isEditing}
            onPostCreated={onPostCreated}
            onPostUpdated={onPostUpdated}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default PostModal;