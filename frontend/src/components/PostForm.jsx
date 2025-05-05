import React, { useState } from 'react';
import axios from 'axios';

const PostForm = ({ onPostCreated , userId}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mediaUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validate form data
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const postData = {
        ...formData,
        userId: userId,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        mediaUrls: formData.mediaUrl ? [formData.mediaUrl] : []
      };

      console.log('Sending post data:', postData); // Debug log

      const response = await axios.post('http://localhost:9090/api/posts', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Enable if using cookies
      });

      console.log('Server response:', response.data); // Debug log

      if (response.data) {
        setSuccess(true);
        setFormData({
          title: '',
          content: '',
          tags: '',
          mediaUrl: ''
        });
        
        // Call the callback with the new post data
        if (onPostCreated) {
          onPostCreated(response.data);
        }
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error creating post:', err); // Debug log
      setError(
        err.response?.data?.message || 
        'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Post created successfully!
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-1">Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
          required
          minLength={3}
          maxLength={100}
          placeholder="Enter post title"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Content *</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
          rows={4}
          required
          minLength={10}
          placeholder="Write your post content here"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
          placeholder="e.g. technology, programming, react"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Media URL</label>
        <input
          type="url"
          name="mediaUrl"
          value={formData.mediaUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <button 
        type="submit" 
        className={`w-full px-4 py-2 rounded text-white ${
          loading 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export default PostForm;