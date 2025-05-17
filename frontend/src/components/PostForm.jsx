import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PostForm.css';
import { uploadFileToFirebase } from '../utils/firebaseStorage';

// More consistent handling of media URLs
const normalizeMediaUrls = (urls) => {
  if (!urls) return [];
  if (typeof urls === 'string') return [urls];
  if (Array.isArray(urls)) return urls.filter(url => url);
  return [];
};

const PostForm = ({ onPostCreated, onPostUpdated, userId, post, isEditing, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mediaUrls: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Set initial form data when post prop changes
  useEffect(() => {
    if (isEditing && post) {
      console.log('Loading post for editing:', post);
      
      // Normalize mediaUrls to always be an array
      const mediaUrls = normalizeMediaUrls(post.mediaUrls || post.mediaUrl || []);
      
      console.log('Setting initial media URLs for editing:', mediaUrls);
      
      setFormData({
        title: post.title || '',
        content: post.content || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        mediaUrls: mediaUrls 
      });
      
      // If there's a media URL, set the preview
      if (mediaUrls.length > 0) {
        setPreview(mediaUrls[0]);
        // Determine if it's a video based on URL
        const isVideo = mediaUrls[0].match(/\.(mp4|webm|mov)$/i) || mediaUrls[0].includes('video');
        setSelectedFile({ type: isVideo ? 'video/mp4' : 'image/jpeg' });
      } else {
        setPreview(null);
        setSelectedFile(null);
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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    // Check total number of files
    if (formData.mediaUrls.length + files.length > 3) {
        setError('Maximum 3 files allowed');
        return;
    }

    // Validate each file
    for (const file of files) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            setError('Each file must be less than 10MB');
            return;
        }

        // Check file type
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            setError('Only image or video files are allowed');
            return;
        }

        // Check video duration
        if (isVideo) {
            try {
                const video = document.createElement('video');
                video.preload = 'metadata';

                const duration = await new Promise((resolve, reject) => {
                    video.onloadedmetadata = () => {
                        window.URL.revokeObjectURL(video.src);
                        resolve(video.duration);
                    };
                    video.onerror = () => reject(new Error('Failed to load video'));
                    video.src = URL.createObjectURL(file);
                });

                if (duration > 31) {
                    setError('Videos must be less than 30 seconds');
                    return;
                }
            } catch (err) {
                setError('Error checking video duration');
                return;
            }
        }
    }

    // Upload files
    setIsUploading(true);
    setError(null);
    
    try {
        // Upload all files to Firebase
        const uploadPromises = files.map(async file => {
            const downloadURL = await uploadFileToFirebase(file, userId);
            return downloadURL;
        });

        const downloadURLs = await Promise.all(uploadPromises);
        
        console.log('Current mediaUrls:', formData.mediaUrls);
        console.log('New URLs to add:', downloadURLs);

        // FIXED: Make sure we're always working with arrays
        setFormData(prev => {
            // Always ensure we're starting with an array
            const currentUrls = Array.isArray(prev.mediaUrls) ? [...prev.mediaUrls] : [];
            const updatedUrls = [...currentUrls, ...downloadURLs].slice(0, 3);
            console.log('Combined URLs after update:', updatedUrls);
            
            return {
                ...prev,
                mediaUrls: updatedUrls
            };
        });

        // Show preview of the last uploaded file
        const lastFile = files[files.length - 1];
        setSelectedFile(lastFile);

        // Create preview for the last file
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(lastFile);

        console.log('Files uploaded successfully:', downloadURLs);
    } catch (err) {
        console.error('Error uploading files:', err);
        setError('Failed to upload files: ' + err.message);
    } finally {
        setIsUploading(false);
    }
};

  const handleRemoveMedia = (index) => {
    console.log(`Removing media at index ${index}`);
    
    if (!Array.isArray(formData.mediaUrls)) {
      console.error('mediaUrls is not an array:', formData.mediaUrls);
      setError('Error removing media: invalid media data');
      return;
    }

    // Create a new array without the removed item
    const updatedUrls = formData.mediaUrls.filter((_, idx) => idx !== index);
    console.log('Media URLs after removal:', updatedUrls);
    
    // Update the form state
    setFormData(prev => ({
      ...prev,
      mediaUrls: updatedUrls
    }));
    
    // Update preview if necessary
    if (updatedUrls.length > 0) {
      setPreview(updatedUrls[0]);
      const isVideo = updatedUrls[0].match(/\.(mp4|webm|mov)$/i) || updatedUrls[0].includes('video');
      setSelectedFile({ type: isVideo ? 'video/mp4' : 'image/jpeg' });
    } else {
      setPreview(null);
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // FIXED: Always normalize mediaUrls before sending
      const mediaUrlsArray = normalizeMediaUrls(formData.mediaUrls);
      console.log('Normalized mediaUrls before submission:', mediaUrlsArray);

      // Prepare post data with normalized media URLs
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        mediaUrls: mediaUrlsArray, // Ensure this is always an array
        userId: userId
      };

      console.log('Submitting post data:', {
        ...postData,
        action: isEditing ? 'update' : 'create',
        postId: isEditing ? post.id : 'new'
      });

      let response;
      if (isEditing && post?.id) {
        response = await axios.put(
          `http://localhost:9090/api/posts/${post.id}`,
          postData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'X-Media-URLs-Count': mediaUrlsArray.length
            }
          }
        );

        console.log('Post updated successfully:', response.data);
        
        // FIXED: Properly update form with normalized media URLs from response
        const receivedMediaUrls = normalizeMediaUrls(response.data.mediaUrls || response.data.mediaUrl || []);
        console.log('Received media URLs after update:', receivedMediaUrls);
        
        // Update the entire form state with all data from response
        setFormData({
          title: response.data.title || '',
          content: response.data.content || '',
          tags: Array.isArray(response.data.tags) ? response.data.tags.join(', ') : (response.data.tags || ''),
          mediaUrls: receivedMediaUrls
        });

        // Make sure we properly call the parent update callback
        if (onPostUpdated) onPostUpdated(response.data);
        if (onSuccess) onSuccess('updated', response.data);
      } else {
        response = await axios.post(
          'http://localhost:9090/api/posts',
          postData,
          { withCredentials: true }
        );

        console.log('Post created successfully:', response.data);

        if (onPostCreated) onPostCreated(response.data);
        if (onSuccess) onSuccess('created', response.data);

        // Reset form after successful creation
        setFormData({
          title: '',
          content: '',
          tags: '',
          mediaUrls: []
        });
        setPreview(null);
        setSelectedFile(null);
      }

      setSuccess(true);

      // FIXED: Always normalize media URLs from response before handling preview
      const updatedMediaUrls = normalizeMediaUrls(response.data.mediaUrls || response.data.mediaUrl || []);
      
      // Handle media preview updates
      if (updatedMediaUrls.length > 0) {
        const firstMedia = updatedMediaUrls[0];
        setPreview(firstMedia);
        const isVideo = firstMedia.match(/\.(mp4|webm|mov)$/i) || firstMedia.includes('video');
        setSelectedFile({ type: isVideo ? 'video/mp4' : 'image/jpeg' });
      } else {
        setPreview(null);
        setSelectedFile(null);
      }

    } catch (err) {
      console.error('Error submitting post:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !post.id) {
      setError('Cannot delete: post ID is missing');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      console.log(`Deleting post with ID: ${post.id}`);
      await axios.delete(`http://localhost:9090/api/posts/${post.id}`, {
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
          Media {formData.mediaUrls && formData.mediaUrls.length > 0 && `(${formData.mediaUrls.length}/3)`}
        </label>
        <div className="media-input-container">
          <div className="file-upload">
            <label className={`file-upload-label white-text ${isUploading ? 'uploading' : ''}`}>
            <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i>
            <span className="upload-text">{isUploading ? 'Uploading...' : 'Upload media'}</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              multiple
              className="hidden"
              disabled={isUploading || (formData.mediaUrls?.length || 0) >= 3}
            />
          </label>
          </div>
        </div>
        {/* FIXED: More robust media preview rendering */}
        {Array.isArray(formData.mediaUrls) && formData.mediaUrls.length > 0 && (
          <div className="media-previews">
            {formData.mediaUrls.map((url, index) => (
              <div key={`preview-${index}-${url}`} className="media-preview-item">
                {(url.match(/\.(mp4|webm|mov|avi)$/i) || 
                  url.includes('video') ||
                  url.includes('firebase') && url.includes('.mp4')) ? (
                  <div className="video-container">
                    <video 
                      controls
                      className="preview-video"
                      preload="metadata"
                      playsInline
                    >
                      <source 
                        src={url} 
                        type={
                          url.match(/\.webm$/i) ? 'video/webm' :
                          url.match(/\.mov$/i) ? 'video/quicktime' :
                          'video/mp4'
                        } 
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="preview-image"
                    loading="lazy"
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="remove-media"
                  data-media-index={index}
                >
                  <i className="fas fa-times"></i>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className={`submit-button ${loading ? 'loading' : ''}`}
          disabled={loading || isUploading}
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
            disabled={loading}
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