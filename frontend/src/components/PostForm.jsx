import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PostForm.css';
import { uploadFileToFirebase } from '../utils/firebaseStorage';


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
  const [isUploading, setIsUploading] = useState(false);

  // Set initial form data when post prop changes
  useEffect(() => {
    if (isEditing && post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        tags: post.tags ? post.tags.join(', ') : '',
        mediaUrl: post.mediaUrls && post.mediaUrls[0] ? post.mediaUrls[0] : ''
      });
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) {
        setError('Only image or video files are allowed');
        return;
      }

      if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
  
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            if (video.duration > 30) {
              setError('Video duration should be less than 30 seconds');
              resolve(false);
            }
            resolve(true);
          };
          video.src = URL.createObjectURL(file);
        });
  
        if (error) return;
      }

      setSelectedFile(file);
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);


    try {
      setIsUploading(true);
      setError(null);
      const downloadURL = await uploadFileToFirebase(file, userId);
      setFormData(prev => ({
        ...prev,
        mediaUrl: downloadURL
      }));
    } catch (err) {
      setError('Failed to upload file: ' + err.message);
    } finally {
      setIsUploading(false);
    }

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        mediaUrls: formData.mediaUrl ? [formData.mediaUrl] : [],
        userId: userId
      };
  
      let response;
      if (isEditing && post?.id) {
        response = await axios.put(
          `http://localhost:9090/api/posts/${post.id}`,
          postData,
          { withCredentials: true }
        );
        if (onSuccess) onSuccess('updated', response.data);
      } else {
        response = await axios.post(
          'http://localhost:9090/api/posts',
          postData,
          { withCredentials: true }
        );
        if (onSuccess) onSuccess('created', response.data);
      }
  
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting post:', err);
      setError(err.response?.data?.message || 'Failed to submit post');
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
            <label className={`file-upload-label ${isUploading ? 'uploading' : ''}`}>
              <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
              {isUploading ? 'Uploading...' : 'Upload media'}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
        {preview && (
          <div className="media-preview">
            {selectedFile?.type.startsWith('video/') ? (
              <video 
                src={preview} 
                controls 
                className="video-preview"
              />
            ) : (
              <img src={preview} alt="Preview" className="image-preview" />
            )}
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setSelectedFile(null);
                setFormData(prev => ({ ...prev, mediaUrl: '' }));
              }}
              className="remove-preview"
              disabled={isUploading}
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