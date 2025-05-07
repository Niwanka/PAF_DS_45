import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Home.css';

const Home = () => {
  const userProfile = {
    name: 'John Doe',
    avatar: 'path/to/avatar.jpg',
    role: 'Admin',
  };

  return (
    <div className="home">
      <Navbar userProfile={userProfile} />
      <div className="main-container">
        <Sidebar userProfile={userProfile} />
        <main className="main-content">
          <h1>Welcome, {userProfile.name}!</h1>
          <p>Your role: {userProfile.role}</p>
        </main>
      </div>
    </div>
  );
};

export default Home;