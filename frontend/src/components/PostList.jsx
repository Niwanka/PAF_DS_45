import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostList.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/profile', {
          withCredentials: true
        });
        setCurrentUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:9090/api/posts', {
          withCredentials: true
        });
        setPosts(response.data);
      } catch (error) {
        setError('Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:9090/api/posts/${postId}/like`, {}, {
        withCredentials: true
      });
      // Update posts to reflect the new like
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = (postId) => {
    // Implement share functionality
    console.log('Sharing post:', postId);
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading posts...</p>
    </div>
  );

  if (error) return (
    <div className="error-message">
      <i className="fas fa-exclamation-circle"></i>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <article key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-author">
              <img 
                src={post.authorPicture || `https://ui-avatars.com/api/?name=${post.authorName}`}
                alt={post.authorName}
                className="author-avatar"
              />
              <div className="author-info">
                <h4>{post.authorName}</h4>
                <p className="post-meta">
                  {post.authorTitle}
                  <span className="post-time">
                    • {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
            {currentUserProfile?.sub === post.userId && (
              <div className="post-actions-menu">
                <button className="action-button">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            )}
          </div>

          <div className="post-content">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-text">{post.content}</p>
            {post.image && (
              <div className="post-media">
                <img src={post.image} alt="Post content" />
              </div>
            )}
          </div>

          <div className="post-stats">
            <span className="likes">
              <i className="fas fa-thumbs-up"></i> {post.likes || 0}
            </span>
            <span className="comments">
              {post.comments?.length || 0} comments
            </span>
          </div>

          <div className="post-actions">
            <button 
              className="action-button"
              onClick={() => handleLike(post.id)}
            >
              <i className="far fa-thumbs-up"></i>
              Like
            </button>
            <button className="action-button">
              <i className="far fa-comment"></i>
              Comment
            </button>
            <button 
              className="action-button"
              onClick={() => handleShare(post.id)}
            >
              <i className="far fa-share-square"></i>
              Share
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PostList;