import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userProfile }) => {
  const navigate = useNavigate();

  return (
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
          onClick={() => navigate(`/profile/${userProfile?.sub}`)}
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

      <div className="learning-nav">
        <div className="learning-nav-title">Learning Navigation</div>
        <a href="/learning-planning" className="learning-nav-link">
          <i className="fas fa-tasks"></i>
          Learning Planning
        </a>
        <a href="/learning-progress" className="learning-nav-link">
          <i className="fas fa-chart-line"></i>
          Learning Progress
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;