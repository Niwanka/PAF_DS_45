import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import ChatBot from './ChatBot';
import UserPosts from './UserPosts';
import PostModal from './PostModal';
import Sidebar from './Sidebar';
//import '../styles/ViewPosts.css';

const ViewPosts = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/profile', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="home">
      <Navbar userProfile={userProfile} />
      
      <main className="main-content">
        <aside>
          <Sidebar userProfile={userProfile} />
        </aside>

        <section className="feed">
          <div className="post-box">
            <div className="post-input">
              <img
                src={userProfile?.picture || `https://ui-avatars.com/api/?name=${userProfile?.name || "User"}`}
                alt="Profile"
              />
              <button 
                className="post-button"
                onClick={() => setIsPostModalOpen(true)}
              >
                Start a post
              </button>
            </div>
            <div className="post-actions">
              <div className="post-action">
                <i className="fas fa-image" style={{ color: "#70b5f9" }}></i>
                <span>Photo</span>
              </div>
              <div className="post-action">
                <i className="fas fa-video" style={{ color: "#7fc15e" }}></i>
                <span>Video</span>
              </div>
              <div className="post-action">
                <i className="fas fa-edit" style={{ color: "#e7a33e" }}></i>
                <span>Write</span>
              </div>
            </div>
          </div>

          <UserPosts userId={userId} />
        </section>

        <aside>
          <div className="chatbot-wrapper">
            <ChatBot />
          </div>
        </aside>
      </main>

      <PostModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        userId={userProfile?.sub}
        onPostCreated={() => {
          setIsPostModalOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default ViewPosts;