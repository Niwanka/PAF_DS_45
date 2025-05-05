import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:9090/api/posts', {
      withCredentials: true  // This is equivalent to 'credentials: include' in fetch
    })
      .then(response => {
        console.log('Fetched posts:', response.data);
        // Check if response.data is an array before setting it
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          // If not an array, set error
          console.error('Response is not an array:', response.data);
          setError('Unexpected response format from server');
          setPosts([]); // Set empty array to avoid mapping errors
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts');
        setPosts([]); // Set empty array to avoid mapping errors
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading posts...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  // Check if posts is empty
  if (posts.length === 0) {
    return <div className="p-4 text-center">No posts available</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div key={index} className="p-4 border rounded shadow bg-white">
          <h3 className="text-lg font-bold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;