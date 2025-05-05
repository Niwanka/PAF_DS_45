import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/users/${userId}`, {
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
    <div className="profile-page">
      <div className="profile-header">
        <div className="cover-photo">
          <img src="https://source.unsplash.com/random/800x200/?gradient" alt="cover" />
        </div>
        <div className="profile-info">
          <img 
            src={userProfile.picture || `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=1a237e&color=fff`}
            alt="profile"
            className="profile-avatar"
          />
          <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
          <p className="profile-title">{userProfile.profession}</p>
          <p className="profile-location">{userProfile.location}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>About</h3>
          <p>{userProfile.bio}</p>
        </div>

        <div className="profile-section">
          <h3>Skills</h3>
          <div className="skills-list">
            {userProfile.skills?.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          <p>{userProfile.education}</p>
        </div>

        <div className="profile-section">
          <h3>Certifications</h3>
          <ul>
            {userProfile.certifications?.map((cert, index) => (
              <li key={index}>{cert}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;