import React from 'react';
import ChatBot from './components/ChatBot';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Add back the navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo">
            <img src="/logo.png" alt="logo" className="logo-img" />
            <h2>Skill Share</h2>
          </div>
          <div className="search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#" className="nav-link active">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-network-wired"></i>
              <span>Network</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-briefcase"></i>
              <span>Jobs</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-comment-dots"></i>
              <span>Messages</span>
              <span className="notification-badge">3</span>
            </a>
            <a href="#" className="nav-link">
              <i className="fas fa-bell"></i>
              <span>Notifications</span>
              <span className="notification-badge">5</span>
            </a>
          </div>
          <div className="user-profile">
            <img 
              src="https://ui-avatars.com/api/?name=John+Doe&background=1a237e&color=fff" 
              alt="profile" 
            />
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Left sidebar and feed sections remain unchanged */}
        <div className="left-sidebar">
          <div className="profile-card">
            <div className="cover-photo">
              <img src="https://source.unsplash.com/random/800x200/?gradient" alt="cover" />
            </div>
            <div className="profile-info">
              <img 
                src="https://ui-avatars.com/api/?name=John+Doe&background=1a237e&color=fff" 
                alt="profile"
                className="profile-avatar" 
              />
              <h3>John Doe</h3>
              <p className="profile-title">Full Stack Developer</p>
              <div className="profile-stats">
                <div className="stat">
                  <span>Profile views</span>
                  <strong>1,234</strong>
                </div>
                <div className="stat">
                  <span>Post impressions</span>
                  <strong>5.6k</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="skills-card">
            <h4><i className="fas fa-star"></i> Featured Skills</h4>
            <div className="skills-list">
              <div className="skill-item">
                <span className="skill-tag">React.js</span>
                <span className="endorsements">+45</span>
              </div>
              <div className="skill-item">
                <span className="skill-tag">Node.js</span>
                <span className="endorsements">+38</span>
              </div>
              <div className="skill-item">
                <span className="skill-tag">MongoDB</span>
                <span className="endorsements">+29</span>
              </div>
              <div className="skill-item">
                <span className="skill-tag">TypeScript</span>
                <span className="endorsements">+24</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="feed">
          <div className="post-composer">
            <img 
              src="https://ui-avatars.com/api/?name=John+Doe&background=1a237e&color=fff" 
              alt="profile" 
            />
            <button className="start-post">
              <i className="far fa-edit"></i>
              Share your knowledge or ask a question...
            </button>
            <div className="post-actions">
              <button className="post-action-btn">
                <i className="fas fa-image"></i>
                <span>Photo</span>
              </button>
              <button className="post-action-btn">
                <i className="fas fa-video"></i>
                <span>Video</span>
              </button>
              <button className="post-action-btn">
                <i className="fas fa-calendar-alt"></i>
                <span>Event</span>
              </button>
            </div>
          </div>

          <div className="posts">
            <article className="post featured">
              <div className="post-badge">
                <i className="fas fa-star"></i> Featured
              </div>
              <div className="post-header">
                <img 
                  src="https://ui-avatars.com/api/?name=Tech+Community&background=1a237e&color=fff" 
                  alt="Tech Community" 
                />
                <div className="post-info">
                  <h4>Tech Community</h4>
                  <p>Trending Discussion</p>
                  <span>2h ago • <i className="fas fa-globe-americas"></i></span>
                </div>
                <button className="post-menu-btn">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
              <div className="post-content">
                <p>🚀 What's your favorite modern web development stack? Share your thoughts and experiences!</p>
                <div className="post-tags">
                  <span>#WebDev</span>
                  <span>#Programming</span>
                  <span>#TechTalk</span>
                </div>
              </div>
              <div className="post-stats">
                <span><i className="fas fa-thumbs-up"></i> 245</span>
                <span>•</span>
                <span>86 comments</span>
              </div>
              <div className="post-actions">
                <button><i className="far fa-thumbs-up"></i> Like</button>
                <button><i className="far fa-comment"></i> Comment</button>
                <button><i className="fas fa-share"></i> Share</button>
              </div>
            </article>

            <article className="post">
              <div className="post-header">
                <img 
                  src="https://ui-avatars.com/api/?name=Sarah+Smith&background=1a237e&color=fff" 
                  alt="Sarah" 
                />
                <div className="post-info">
                  <h4>Sarah Smith</h4>
                  <p>Senior Frontend Developer at TechCorp</p>
                  <span>4h ago • <i className="fas fa-globe-americas"></i></span>
                </div>
              </div>
              <div className="post-content">
                <p>Excited to share that I just completed an advanced React course! Here are some key takeaways about performance optimization and hooks 🎉</p>
                <img 
                  src="https://source.unsplash.com/random/600x400/?coding" 
                  alt="post" 
                  className="post-image" 
                />
              </div>
              <div className="post-stats">
                <span><i className="fas fa-thumbs-up"></i> 132</span>
                <span>•</span>
                <span>45 comments</span>
              </div>
              <div className="post-actions">
                <button><i className="far fa-thumbs-up"></i> Like</button>
                <button><i className="far fa-comment"></i> Comment</button>
                <button><i className="fas fa-share"></i> Share</button>
              </div>
            </article>
          </div>
        </div>

        {/* Right sidebar with ChatBot */}
        <div className="right-sidebar">
          <ChatBot />
        </div>
      </main>
    </div>
  );
};

export default Home;