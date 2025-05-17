import React from 'react';

import { useNavigate } from 'react-router-dom';


const Sidebar = ({ userProfile }) => {
  const navigate = useNavigate();

  return (

    <aside className="fixed top-20 left-4 w-[300px] bg-white rounded-3xl shadow-sm overflow-hidden h-[calc(100vh-6rem)] transition-all duration-300 ease-in-out">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-20 bg-blue-600"></div>
        <div className="px-6 pb-4">
          {/* Avatar */}
          <div className="relative -mt-10 mb-4 flex justify-center">
            <div 
              className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/profile/${userProfile?.sub}`)}
            >
              {userProfile?.picture ? (
                <img 
                  src={userProfile.picture}
                  alt={`${userProfile.firstName} ${userProfile.lastName}`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>
                  {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                </span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Yasasvi Atigala'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Learning, Sharing, Growing ✨
            </p>
          </div>
        </div>
      </div>
      
      {/* Add a scrollable container for the content */}
      <div className="overflow-y-auto h-[calc(100%-12rem)] pb-6">
        {/* Profile Stats */}
        <div className="px-6 py-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-600">Who's viewed your profile</span>
            <span className="text-[15px] text-gray-700">47</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-gray-600">Post impressions</span>
            <span className="text-[15px] text-gray-700">251</span>
          </div>
        </div>

        {/* Learning Navigation */}
        <div className="px-6 py-4">
          <h3 className="text-blue-600 text-lg font-medium mb-3">Learning Navigation</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 flex items-center justify-center">
                📋
              </div>
              <span className="text-[15px] text-gray-500">Learning Planning</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-5 h-5 flex items-center justify-center">
                📊
              </div>
              <span className="text-[15px] text-gray-500">Learning Progress</span>
            </div>

            {/* Added My Posts section */}
            <div 
              className="flex items-center gap-3 text-gray-600 cursor-pointer"
              onClick={() => navigate(`/user-posts/${userProfile?.sub}`)}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                📝
              </div>
              <span className="text-[15px] text-gray-500">My Posts</span>
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
