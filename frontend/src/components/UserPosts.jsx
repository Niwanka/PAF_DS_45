import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostModal from './PostModal';
import '../styles/UserPosts.css';

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});

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

  const fetchUserProfiles = async () => {
    try {
      const response = await axios.get(
        'http://localhost:9090/api/profile/all',
        { 
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      // Create a map of userId to profile picture
      const profileMap = {};
      response.data.forEach(user => {
        if (user.sub && user.picture) {
          profileMap[user.sub] = user.picture;
        }
      });
      
      setUserProfiles(profileMap);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts();
      await fetchUserProfiles();
    };
    fetchData();
  }, [userId]);

  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
    setEditingPost(null);
  };

// ...existing code...

const handleDeletePost = async (postId) => {
  try {
    // Add strict validation for postId
    if (!postId) {
      console.error('Invalid post ID:', postId);
      setError('Cannot delete post: Invalid post ID');
      return;
    }

    console.log('Attempting to delete post with ID:', postId);

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    const response = await axios.delete(`http://localhost:9090/api/posts/${postId}`, {
      withCredentials: true
    });

    if (response.status === 204 || response.status === 200) {
      // Update local state after successful deletion
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      console.log('Post deleted successfully');
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    setError(err.response?.data?.message || 'Failed to delete post');
  }
};

// ...existing code...

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
                src={userProfiles[post.userId] || `https://ui-avatars.com/api/?name=${post.userName || "User"}&background=random`}
                alt={post.userName}
                className="user-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${post.userName || "User"}&background=random`;
                }}
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
                      onClick={() => {
                        if (post && post.id) {
                          handleDeletePost(post.id);
                        } else {
                          console.error('Invalid post data:', post);
                          setError('Cannot delete post: Missing post data');
                        }
                      }}
                      className="delete-button"
                      title="Delete post"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
            </div>
          </div>
          
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>
          

          
           
          {post.mediaUrls?.length > 0 && (
            <div className={`post-media-grid media-count-${post.mediaUrls.length}`}>
              {post.mediaUrls.slice(0, 3).map((mediaUrl, index) => (
                <div key={`${post._id}-media-${index}`} className="media-item">
                  {(mediaUrl.match(/\.(mp4|webm|mov|avi)$/i) || 
                    mediaUrl.includes('video') ||
                    mediaUrl.includes('firebase') && mediaUrl.includes('.mp4')) ? (
                    <div className="video-container">
                      <video 
                        controls
                        className="post-video"
                        preload="metadata"
                        playsInline
                      >
                        <source 
                          src={mediaUrl} 
                          type={
                            mediaUrl.match(/\.webm$/i) ? 'video/webm' :
                            mediaUrl.match(/\.mov$/i) ? 'video/quicktime' :
                            'video/mp4'
                          } 
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ) : (
                    <img 
                      src={mediaUrl} 
                      alt={`Media ${index + 1} for ${post.title}`} 
                      className="post-image"
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

            {post.tags?.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={`${post._id}-tag-${index}`} className="tag">
                  {tag}
                </span>
              ))}
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