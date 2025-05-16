import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import PostList from './components/PostList';
import PostModal from './components/PostModal';
import Sidebar from './components/Sidebar';


const Home = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:9090/user", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Not authenticated");
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      }
    };

    fetchUserData();
  }, [navigate]);

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
        {/* Left Sidebar - Profile Section */}
        <aside >
          <Sidebar userProfile={userProfile} />
        </aside>

        {/* Main Feed */}
        <section className="feed">
          <div className="post-box">
            <div className="post-input">
              <img
                src={
                  user?.picture ||
                  `https://ui-avatars.com/api/?name=${user?.name || "User"}`
                }
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
                <i className="fas fa-calendar" style={{ color: "#e7a33e" }}></i>
                <span>Event</span>
              </div>
              <div className="post-action">
                <i
                  className="fas fa-newspaper"
                  style={{ color: "#fc9295" }}
                ></i>
                <span>Write article</span>
              </div>
            </div>
          </div>
          {/* Add posts here */}
          <div>
          <PostList/>
          </div>
        </section>

        {/* Right Sidebar - ChatBot Section */}
        <aside className="sticky top-20 h-[calc(100vh-5rem)]">
          <div className="h-full">
            <ChatBot />
          </div>
        </aside>
      </main>
      <PostModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        userId={userProfile?.sub} 
      />
    </div>
  );
};

export default Home;
