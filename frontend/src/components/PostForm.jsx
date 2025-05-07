import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostForm.css';

const PostForm = ({ onPostCreated, onPostUpdated, userId, post, isEditing, onSuccess }) => {
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
  const [isFetching, setIsFetching] = useState(false);

  // Set initial form data when post prop changes
  useEffect(() => {
    if (isEditing && post) {
      console.log('Editing post:', post);
      setFormData({
        title: post.title || '',
        content: post.content || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        mediaUrl: Array.isArray(post.mediaUrls) ? post.mediaUrls[0] : (post.mediaUrls || '')
      });
      if (post.mediaUrls && post.mediaUrls[0]) {
        setPreview(post.mediaUrls[0]);
      }
    }
  }, [isEditing, post]);

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
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          mediaUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || isFetching) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const postData = {
        ...formData,
        userId,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        mediaUrls: formData.mediaUrl ? [formData.mediaUrl] : []
      };

      let response;
      
      // Check if we're in edit mode and have a post ID
      if (isEditing && post && post._id) {
        console.log(`Updating post with ID: ${post._id}`);
        
        // Update existing post
        response = await axios.put(
          `http://localhost:9090/api/posts/${post._id}`,
          postData,
          { 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );
        
        if (response.data) {
          setSuccess(true);
          if (onPostUpdated) onPostUpdated(response.data);
          if (onSuccess) onSuccess('updated');
        }
      } else {
        // Create new post
        response = await axios.post(
          'http://localhost:9090/api/posts',
          postData,
          { 
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' }
          }
        );

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
          if (onSuccess) onSuccess('created');
        }
      }
    } catch (err) {
      console.error('Error submitting post:', err);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} post`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !post._id) {
      setError('Cannot delete: post ID is missing');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      console.log(`Deleting post with ID: ${post._id}`);
      await axios.delete(`http://localhost:9090/api/posts/${post._id}`, {
        withCredentials: true
      });
      setSuccess(true);
      
      // Call onSuccess with 'deleted' action to notify parent
      if (onSuccess) onSuccess('deleted');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return <div className="loading">Loading post data...</div>;
  }

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
          {isEditing ? 'Post updated successfully!' : 'Post created successfully!'}
        </div>
      )}

      <div className="form-group">
        <label>
          <i className="fas fa-heading"></i>
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What's your post about?"
          required
          className="form-input"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label>
          <i className="fas fa-pen"></i>
          Content *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share your thoughts..."
          required
          className="form-textarea"
          rows={6}
          maxLength={2000}
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
                setFormData(prev => ({ ...prev, mediaUrl: '' }));
              }}
              className="remove-preview"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className={`submit-button ${loading ? 'loading' : ''}`}
          disabled={loading || isFetching}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              {isEditing ? 'Updating Post...' : 'Creating Post...'}
            </>
          ) : (
            <>
              <i className={`fas fa-${isEditing ? 'save' : 'paper-plane'}`}></i>
              {isEditing ? 'Update Post' : 'Create Post'}
            </>
          )}
        </button>

        {isEditing && (
          <button 
            type="button"
            onClick={handleDelete}
            className="delete-button"
            disabled={loading || isFetching}
          >
            <i className="fas fa-trash"></i>
            Delete Post
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;