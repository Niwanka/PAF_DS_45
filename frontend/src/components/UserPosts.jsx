import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostModal from './PostModal';
import './UserPosts.css';

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9090/api/posts/user/${userId}`,
        { withCredentials: true }
      );
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === updatedPost._id ? updatedPost : post
      )
    );
    setEditingPost(null);
  };

  const handleDeletePost = async (postId) => {
    // Verify postId exists
    if (!postId) {
      console.error('Cannot delete post: post ID is undefined');
      setError('Cannot delete post: Invalid post ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      console.log(`Deleting post with ID: ${postId}`);
      await axios.delete(`http://localhost:9090/api/posts/${postId}`, {
        withCredentials: true
      });
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  // Handle post deleted from modal
  const handlePostDeleted = (postId) => {
    console.log(`Post deleted from modal, ID: ${postId}`);
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    setEditingPost(null);
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="no-posts">No posts yet</div>;
  }

  return (
    <div className="user-posts">
      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-header">
            <div className="post-user-info">
              <img
                src={post.userPicture || `https://ui-avatars.com/api/?name=${post.userName || "User"}`}
                alt={post.userName}
                className="user-avatar"
              />
              <div>
                <h3 className="user-name">{post.userName}</h3>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="post-actions">
              <button 
                onClick={() => setEditingPost(post)}
                className="edit-button"
                title="Edit post"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                onClick={() => handleDeletePost(post._id)}
                className="delete-button"
                title="Delete post"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>
          
          {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={`${post._id}-tag-${index}`} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {post.mediaUrls?.[0] && (
            <div className="post-media">
              <img src={post.mediaUrls[0]} alt={`Media for ${post.title}`} />
            </div>
          )}
        </div>
      ))}

      {editingPost && (
        <PostModal
          isOpen={true}
          onClose={() => setEditingPost(null)}
          userId={userId}
          post={editingPost}
          isEditing={true}
          onPostUpdated={handlePostUpdated}
          onPostDeleted={handlePostDeleted}
        />
      )}
    </div>
  );
};

export default UserPosts;