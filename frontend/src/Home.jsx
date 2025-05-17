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
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar userProfile={userProfile} />
      
      <main className="max-w-[1440px] mx-auto px-4 py-6 mt-16">
        <div className="grid grid-cols-[300px_minmax(0,_650px)_350px] gap-6">
          {/* Left Sidebar */}
          <aside className="sticky top-20">
            <Sidebar userProfile={userProfile} />
          </aside>

          {/* Main Feed */}
          <section>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={userProfile?.picture || `https://ui-avatars.com/api/?name=${userProfile?.name || "User"}`}
                  alt="Profile"
                  className="h-12 w-12 rounded-full border-2 border-gray-100"
                />
                <button 
                  className="flex-1 text-left px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-500 text-sm"
                  onClick={() => setIsPostModalOpen(true)}
                >
                  Start a post
                </button>
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600">
                  <i className="fas fa-image text-[#70b5f9]"></i>
                  <span>Photo</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600">
                  <i className="fas fa-video text-[#7fc15e]"></i>
                  <span>Video</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600">
                  <i className="fas fa-calendar text-[#e7a33e]"></i>
                  <span>Event</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600">
                  <i className="fas fa-newspaper text-[#fc9295]"></i>
                  <span>Article</span>
                </div>
              </div>
            </div>
            <PostList />
          </section>

          {/* Right Sidebar - ChatBot */}
          <aside className="sticky top-20">
            <ChatBot />
          </aside>
        </div>
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
