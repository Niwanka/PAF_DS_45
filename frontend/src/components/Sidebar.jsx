import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ userProfile }) => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-profile-card">
        <div className="profile-background"></div>
        <div className="profile-info">
          <img 
            src={userProfile?.picture || `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}`}
            alt="Profile"
            className="sidebar-profile-photo"
            onClick={() => navigate(`/profile/${userProfile?.sub}`)}
          />
          <h3 className="sidebar-name">{`${userProfile?.firstName} ${userProfile?.lastName}`}</h3>
          <p className="sidebar-headline">{userProfile?.headline || 'No headline added'}</p>
        </div>
      </div>

      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-label">Profile views</span>
          <span className="stat-value">128</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Post impressions</span>
          <span className="stat-value">845</span>
        </div>
      </div>

      <div className="sidebar-premium">
        <h4>Access exclusive tools & insights</h4>
        <a href="#premium" className="premium-link">
          <i className="fas fa-square"></i> Try Premium
        </a>
      </div>

      <div className="sidebar-items">
        <a href="#groups" className="sidebar-item">
          <i className="fas fa-users"></i> Groups
        </a>
        <a href="#events" className="sidebar-item">
          <i className="fas fa-calendar"></i> Events
        </a>
        <a href="#topics" className="sidebar-item">
          <i className="fas fa-hashtag"></i> Followed Topics
        </a>
      </div>
    </div>
  );
};

export default Sidebar;