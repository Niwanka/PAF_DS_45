import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserPage.css';

const UserPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/profile/${userId}`, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load user profile');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <div className="user-page-loading">Loading...</div>;
    }

    if (error) {
        return <div className="user-page-error">{error}</div>;
    }

    if (!userData) {
        return <div className="user-page-not-found">User not found</div>;
    }

    return (
        <div className="user-page">
            <div className="user-header">
                <div className="user-cover-photo"></div>
                <div className="user-profile-section">
                    <img 
                        src={userData.picture || `https://ui-avatars.com/api/?name=${userData.firstName}+${userData.lastName}`}
                        alt={`${userData.firstName} ${userData.lastName}`}
                        className="user-profile-picture"
                    />
                    <div className="user-info">
                        <h1>{`${userData.firstName} ${userData.lastName}`}</h1>
                        <p className="user-headline">{userData.profession || 'No profession listed'}</p>
                        <p className="user-location">{userData.location || 'No location specified'}</p>
                    </div>
                </div>
            </div>

            <div className="user-content">
                <div className="user-about">
                    <h2>About</h2>
                    <p>{userData.bio || 'No bio available'}</p>
                </div>

                <div className="user-skills">
                    <h2>Skills</h2>
                    <div className="skills-list">
                        {userData.skills && userData.skills.length > 0 ? (
                            userData.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))
                        ) : (
                            <p>No skills listed</p>
                        )}
                    </div>
                </div>

                <div className="user-education">
                    <h2>Education</h2>
                    <p>{userData.education || 'No education listed'}</p>
                </div>

                <div className="user-certifications">
                    <h2>Certifications</h2>
                    {userData.certifications && userData.certifications.length > 0 ? (
                        <ul>
                            {userData.certifications.map((cert, index) => (
                                <li key={index}>{cert}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No certifications listed</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPage;