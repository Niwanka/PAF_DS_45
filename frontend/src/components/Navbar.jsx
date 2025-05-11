import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import NotificationList from './NotificationList';
import '../styles/Navbar.css';

const Navbar = ({ userProfile }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/home" className="nav-brand">
          <span>Skill Share</span>
        </a>
        <SearchBox />
      </div>
      
      <div className="nav-menu">
        <a href="/home" className="nav-item">
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
        <div className="nav-item notification-item">
          <i className="fas fa-bell"></i>
          <span>Notifications</span>
          <div className="notification-dropdown">
            <NotificationList userId={userProfile?.sub} />
          </div>
        </div>
        <div 
          className="nav-item profile-item"
          onClick={() => navigate(`/profile/${userProfile?.sub}`)}
        >
          <img
            src={userProfile?.picture || `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}`}
            alt="Profile"
            className="nav-profile-photo"
          />
          <span>Me</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;