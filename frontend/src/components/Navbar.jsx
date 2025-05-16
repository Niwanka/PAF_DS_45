import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchBox from './SearchBox';
import NotificationList from './NotificationList';
import '../styles/Navbar.css';

const Navbar = ({ userProfile }) => {
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userProfile?.sub) {
      checkUnreadNotifications();
    }
  }, [userProfile]);

  const checkUnreadNotifications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9090/api/notifications/user/${userProfile.sub}`,
        { withCredentials: true }
      );
      const notifs = response.data;
      setNotifications(notifs);
      const hasUnread = notifs.length > 0 && notifs.some(notification => !notification.isRead);
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error('Failed to check notifications:', error);
      setHasUnreadNotifications(false);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.notifications-container') && !e.target.closest('.notification-button')) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full gap-8">
          {/* Logo and Search */}
          <div className="flex items-center gap-8 flex-1">
            <a href="/home" className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-[#2563EB]" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2V3zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7V3z"/>
                </svg>
                <span className="text-[#2563EB] text-xl font-semibold">SkillShare</span>
              </div>
            </a>
            
            <div className="w-full max-w-xl">
              <SearchBox />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {/* Mail Icon */}
            <button className="p-2 text-gray-500 hover:text-[#2563EB] transition-colors relative">
              <i className="far fa-envelope text-xl"></i>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 text-gray-500 hover:text-[#2563EB] transition-colors relative notification-button"
                onClick={toggleNotifications}
              >
                <i className="far fa-bell text-xl"></i>
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-[#2563EB] rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <NotificationList 
                    userId={userProfile?.sub} 
                    onNotificationRead={() => {
                      setHasUnreadNotifications(false);
                      checkUnreadNotifications();
                    }}
                  />
                </div>
              )}
            </div>

            {/* Profile */}
            <button 
              className="flex items-center gap-2"
              onClick={() => navigate(`/profile/${userProfile?.sub}`)}
            >
              <img
                src={userProfile?.picture || `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}&background=2563EB&color=fff`}
                alt="Profile"
                className="h-8 w-8 rounded-full border-2 border-[#2563EB]/20"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;