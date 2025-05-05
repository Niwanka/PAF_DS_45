import React from 'react';
import PostForm from './PostForm';
import './PostModal.css';

const PostModal = ({ isOpen, onClose, userId }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create a post</h2>
          <button 
            onClick={onClose}
            className="close-button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-content">
          <PostForm onSuccess={onClose} userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default PostModal;