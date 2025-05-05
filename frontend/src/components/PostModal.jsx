import React from 'react';
import PostForm from './PostForm';

const PostModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i>
        </button>
        <PostForm onSuccess={onClose} />
      </div>
    </div>
  );
};

export default PostModal;