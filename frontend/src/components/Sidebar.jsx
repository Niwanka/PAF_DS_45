import React from "react";
import "./Sidebar.css";
import { useNavigate, Link } from "react-router-dom";


const Sidebar = ({ userProfile }) => {
  const navigate = useNavigate();

  return (
    <aside className="profile-section">
      <div className="profile-background"></div>
      <div className="profile-content">
        <img
          src={
            userProfile?.picture ||
            `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${
              userProfile?.lastName || "User"
            }`
          }
          alt="Profile"
          className="profile-photo"
          onClick={() => navigate(`/profile/${userProfile?.sub}`)}
        />
        <h2 className="profile-name">
          {userProfile
            ? `${userProfile.firstName} ${userProfile.lastName}`
            : "Loading..."}
        </h2>
        <p className="profile-headline">
          {userProfile?.profession || "Add a headline"}
        </p>
      </div>

      <div className="learning-nav">
        <div className="learning-nav-title">Learning Navigation</div>
        <Link to="/learning-plans" className="learning-nav-link">
          <i className="fas fa-book"></i>
          Learning Plans
        </Link>

        <a href="/learning-progress" className="learning-nav-link">
          <i className="fas fa-chart-line"></i>
          Learning Progress
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
