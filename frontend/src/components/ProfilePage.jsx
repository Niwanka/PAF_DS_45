import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:9090/api/profile`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const data = await response.json();
      setUserProfile(data);
      setEditedProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(userProfile);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setEditedProfile(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:9090/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Credentials': 'true'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(editedProfile)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setIsEditing(false);
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:9090/api/profile', {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Credentials': 'true'
          },
          credentials: 'include',
          mode: 'cors'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete account');
        }

        // On successful deletion
        alert('Account deleted successfully');
        // Redirect to logout endpoint
        window.location.href = 'http://localhost:9090/logout';
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.message);
      }
    }
  };

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
            src={userProfile.picture || `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}`}
            alt="profile"
            className="profile-avatar"
          />
          {isEditing ? (
            <div className="edit-fields">
              <input
                type="text"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <input
                type="text"
                name="lastName"
                value={editedProfile.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          ) : (
            <h2>{`${userProfile.firstName} ${userProfile.lastName}`}</h2>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>About</h3>
          {isEditing ? (
            <textarea
              name="bio"
              value={editedProfile.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          ) : (
            <p>{userProfile.bio}</p>
          )}
        </div>

        <div className="profile-section">
          <h3>Professional Information</h3>
          {isEditing ? (
            <>
              <input
                type="text"
                name="profession"
                value={editedProfile.profession}
                onChange={handleChange}
                placeholder="Profession"
              />
              <input
                type="text"
                name="location"
                value={editedProfile.location}
                onChange={handleChange}
                placeholder="Location"
              />
            </>
          ) : (
            <>
              <p><strong>Profession:</strong> {userProfile.profession}</p>
              <p><strong>Location:</strong> {userProfile.location}</p>
            </>
          )}
        </div>

        <div className="profile-section">
          <h3>Skills</h3>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.skills?.join(', ')}
              onChange={handleSkillsChange}
              placeholder="Enter skills (comma-separated)"
            />
          ) : (
            <div className="skills-list">
              {userProfile.skills?.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          )}
        </div>

        <div className="profile-section">
          <h3>Education</h3>
          {isEditing ? (
            <input
              type="text"
              name="education"
              value={editedProfile.education}
              onChange={handleChange}
              placeholder="Education"
            />
          ) : (
            <p>{userProfile.education}</p>
          )}
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSave}>Save Changes</button>
              <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn-edit" onClick={handleEdit}>Edit Profile</button>
              <button className="btn-delete" onClick={handleDelete}>Delete Account</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;