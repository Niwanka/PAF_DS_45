import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
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
        <Post
          key={post.id}
          post={post}
          currentUserProfile={currentUserProfile}
          onLike={handleLike}
          onShare={handleShare}
        />
      ))}
    </div>
  );
};

export default PostList;