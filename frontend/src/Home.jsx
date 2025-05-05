import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import SearchBox from './components/SearchBox';

const Home = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

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
      <nav className="navbar">
        <div className="nav-left">
          <a href="/home" className="nav-brand">
            Skill Share
          </a>
          <SearchBox />
        </div>
        <div className="nav-menu">
          <a href="/home" className="nav-item active">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="#network" className="nav-item">
            <i className="fas fa-user-friends"></i>
            <span>Network</span>
          </a>
          <a href="#jobs" className="nav-item">
            <i className="fas fa-briefcase"></i>
            <span>Jobs</span>
          </a>
          <a href="#messaging" className="nav-item">
            <i className="fas fa-comment-dots"></i>
            <span>Messaging</span>
          </a>
          <a href="#notifications" className="nav-item">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </a>
          <div 
            className="nav-item"
            onClick={() => navigate(`/profile/${userProfile?.sub}`)}
          >
            <img
              src={
                userProfile?.picture ||
                `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName || "User"}`
              }
              alt="Profile"
              className="nav-profile-photo"
            />
            <span>Me</span>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Left Sidebar - Profile Section */}
        <aside className="profile-section">
          <div className="profile-background"></div>
          <div className="profile-content">
            <img
              src={
                userProfile?.picture ||
                `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName || "User"}`
              }
              alt="Profile"
              className="profile-photo"
            />
            <h2 className="profile-name">
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Loading...'}
            </h2>
            <p className="profile-headline">{userProfile?.profession || 'Add a headline'}</p>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span>Who's viewed your profile</span>
              <strong>47</strong>
            </div>
            <div className="stat-item">
              <span>Post impressions</span>
              <strong>251</strong>
            </div>
          </div>
          <div class="learning-nav">
            <div class="learning-nav-title">Learning Navigation</div>
            <a href="/learning-planning" class="learning-nav-link">
              <i class="fas fa-tasks"></i>
              Learning Planning
            </a>
            <a href="/learning-progress" class="learning-nav-link">
              <i class="fas fa-chart-line"></i>
              Learning Progress
            </a>
          </div>
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
              <button className="post-button">Start a post</button>
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
        </section>

        {/* Right Sidebar - News Section */}
        <aside className="news-section">
          <div className="news-header">
            <h2 className="news-title">Latest News</h2>
            <i className="fas fa-info-circle"></i>
          </div>
          {/* News items */}
          <div className="news-item">
            <div className="news-bullet"></div>
            <div className="news-content">
              <h4>Top news: Tech industry updates</h4>
              <span className="news-time">4h ago • 4,305 readers</span>
            </div>
          </div>
          {/* Add more news items */}
        </aside>
      </main>
    </div>
  );
};

export default Home;
