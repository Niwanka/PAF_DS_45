import React, { useState } from 'react';
import axios from 'axios';
import './PostForm.css';

const PostForm = ({ onPostCreated, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mediaUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        userId,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        mediaUrls: formData.mediaUrl ? [formData.mediaUrl] : []
      };

      const response = await axios.post('http://localhost:9090/api/posts', postData, {
        withCredentials: true
      });

      if (response.data) {
        setSuccess(true);
        setFormData({
          title: '',
          content: '',
          tags: '',
          mediaUrl: ''
        });
        setPreview(null);
        setSelectedFile(null);
        if (onPostCreated) onPostCreated(response.data);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-create-form">
      {error && (
        <div className="form-alert error">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      {success && (
        <div className="form-alert success">
          <i className="fas fa-check-circle"></i>
          Post created successfully!
        </div>
      )}

      <div className="form-group">
        <label>
          <i className="fas fa-heading"></i>
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What's your post about?"
          required
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>
          <i className="fas fa-pen"></i>
          Content
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share your thoughts..."
          required
          className="form-textarea"
          rows={6}
        />
      </div>

      <div className="form-group">
        <label>
          <i className="fas fa-tags"></i>
          Tags
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Add tags (comma separated)"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>
          <i className="fas fa-image"></i>
          Media
        </label>
        <div className="media-input-container">
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
            placeholder="Add image URL"
            className="form-input"
          />
          <div className="file-upload">
            <label className="file-upload-label">
              <i className="fas fa-upload"></i>
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
              }}
              className="remove-preview"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>

      <button 
        type="submit" 
        className={`submit-button ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Creating Post...
          </>
        ) : (
          <>
            <i className="fas fa-paper-plane"></i>
            Create Post
          </>
        )}
      </button>
    </form>
  );
};

export default PostForm;