import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <h2>SkillShare</h2>
          </div>
          <div className="search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search skills, mentors..." />
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#" className="nav-link active">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-users"></i>
              <span>My Network</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-graduation-cap"></i>
              <span>Learning</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
            </a>
          </div>
          <div className="user-profile">
            <img src="https://ui-avatars.com/api/?name=John+Doe" alt="profile" />
            <span>Me ▾</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Left Sidebar */}
        <aside className="left-sidebar">
          <div className="profile-card">
            <div className="cover-photo"></div>
            <div className="profile-info">
              <img src="https://ui-avatars.com/api/?name=John+Doe" alt="profile" />
              <h3>John Doe</h3>
              <p>Full Stack Developer</p>
              <div className="profile-stats">
                <div className="stat">
                  <span>Who viewed your profile</span>
                  <strong>47</strong>
                </div>
                <div className="stat">
                  <span>Skills endorsed</span>
                  <strong>12</strong>
                </div>
              </div>
            </div>
          </div>
          
          <div className="skills-card">
            <h4>My Top Skills</h4>
            <div className="skills-list">
              <span className="skill-tag">React.js</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">MongoDB</span>
              <span className="skill-tag">TypeScript</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <section className="feed">
          <div className="post-composer">
            <img src="https://ui-avatars.com/api/?name=John+Doe" alt="profile" />
            <button className="start-post">
              Share your skills or ask a question...
            </button>
          </div>

          {/* Sample Posts */}
          <div className="posts">
            <article className="post">
              <div className="post-header">
                <img src="https://ui-avatars.com/api/?name=Sarah+Smith" alt="Sarah" />
                <div className="post-info">
                  <h4>Sarah Smith</h4>
                  <p>Senior Frontend Developer</p>
                  <span>2h ago</span>
                </div>
              </div>
              <div className="post-content">
                <p>Just completed an advanced React course! Here are some key takeaways about performance optimization and hooks 🚀</p>
                <img src="https://source.unsplash.com/random/600x400/?coding" alt="post" className="post-image" />
              </div>
              <div className="post-actions">
                <button><i className="far fa-thumbs-up"></i> Like</button>
                <button><i className="far fa-comment"></i> Comment</button>
                <button><i className="fas fa-share"></i> Share</button>
              </div>
            </article>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="trending-card">
            <h4>Trending Skills</h4>
            <div className="trending-list">
              <div className="trending-item">
                <i className="fas fa-chart-line"></i>
                <div>
                  <h5>Machine Learning</h5>
                  <p>1,234 people learning</p>
                </div>
              </div>
              <div className="trending-item">
                <i className="fas fa-code"></i>
                <div>
                  <h5>Cloud Computing</h5>
                  <p>892 people learning</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Home;