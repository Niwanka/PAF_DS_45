import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import '../styles/PostList.css';

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

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
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
        <Post
          key={post.id}
          post={post}
          currentUserProfile={currentUserProfile}
          onPostUpdate={handlePostUpdate}
        />
      ))}
    </div>
  );
};

export default PostList;