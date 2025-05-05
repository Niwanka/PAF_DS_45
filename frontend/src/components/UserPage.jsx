import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // We can reuse the same CSS

const UserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/profile/${userId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUserProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!userProfile) return <div>User not found</div>;

    return (
        <div className="home">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-left">
                    <a href="/home" className="nav-brand">Skill Share</a>
                    <div className="search-box">
                        <i className="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Search" />
                    </div>
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
                </div>
            </nav>

            <div className="profile-main-content">
                <div className="profile-container">
                    <div className="profile-header-wrapper">
                        <div className="cover-photo-container">
                            <img 
                                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200" 
                                alt="cover" 
                                className="cover-image"
                            />
                        </div>
                        
                        <div className="profile-header-content">
                            <div className="profile-photo-container">
                                <img 
                                    src={userProfile.picture || `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&size=200`}
                                    alt="profile" 
                                    className="profile-photo"
                                />
                            </div>

                            <div className="profile-info-container">
                                <h1 className="profile-name">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
                                <p className="profile-headline">{userProfile.profession || 'No profession listed'}</p>
                                <p className="profile-location">
                                    <i className="fas fa-map-marker-alt"></i> {userProfile.location || 'No location specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-card about-card">
                            <h3><i className="fas fa-user"></i> About</h3>
                            <p>{userProfile.bio || 'No bio available'}</p>
                        </div>

                        <div className="profile-card experience-card">
                            <h3><i className="fas fa-briefcase"></i> Experience</h3>
                            <div className="experience-list">
                                {userProfile.experience || 'No experience listed'}
                            </div>
                        </div>

                        <div className="profile-card education-card">
                            <h3><i className="fas fa-graduation-cap"></i> Education</h3>
                            <div className="education-list">
                                {userProfile.education || 'No education listed'}
                            </div>
                        </div>

                        <div className="profile-card skills-card">
                            <h3><i className="fas fa-code"></i> Skills</h3>
                            <div className="skills-container">
                                {userProfile.skills?.map((skill, index) => (
                                    <span key={index} className="skill-badge">{skill}</span>
                                )) || 'No skills listed'}
                            </div>
                        </div>

                        {userProfile.certifications && userProfile.certifications.length > 0 && (
                            <div className="profile-card certifications-card">
                                <h3><i className="fas fa-certificate"></i> Certifications</h3>
                                <div className="certifications-list">
                                    {userProfile.certifications.map((cert, index) => (
                                        <div key={index} className="certification-item">{cert}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {userProfile.languages && userProfile.languages.length > 0 && (
                            <div className="profile-card languages-card">
                                <h3><i className="fas fa-language"></i> Languages</h3>
                                <div className="languages-list">
                                    {userProfile.languages.map((language, index) => (
                                        <span key={index} className="language-badge">{language}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;