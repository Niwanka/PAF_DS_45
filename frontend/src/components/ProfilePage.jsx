import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProfilePage.css";
import SearchBox from "./SearchBox"; // Assuming you have a SearchBox component
import FollowButton from "./FollowButton"; // Assuming you have a FollowButton component
import Navbar from "./Navbar";

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
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
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
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setEditedProfile((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedProfileData = {
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        profession: editedProfile.profession,
        location: editedProfile.location,
        bio: editedProfile.bio,
        experience: editedProfile.experience,
        education: editedProfile.education,
        skills: editedProfile.skills,
      };

      const response = await fetch("http://localhost:9090/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedProfileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update profile: " + err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch("http://localhost:9090/api/profile", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Access-Control-Allow-Credentials": "true",
          },
          credentials: "include",
          mode: "cors",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete account");
        }

        toast.success("Account deleted successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () =>
            (window.location.href = "http://localhost:9090/logout"),
        });
      } catch (err) {
        console.error("Delete error:", err);
        toast.error(err.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!userProfile) return <div>User not found</div>;

  return (
    <div className="home">
      <Navbar userProfile={userProfile} />
      
      <div className="profile-main-content">
        <div className="profile-container">
          <div className="profile-header-wrapper">
            <div className="cover-photo-container">
              <img
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200"
                alt="cover"
                className="cover-image"
              />
              {isEditing && (
                <button className="change-cover-btn">
                  <i className="fas fa-camera"></i> Change Cover
                </button>
              )}
            </div>

            <div className="profile-header-content">
              <div className="profile-photo-container">
                <img
                  src={
                    userProfile?.picture ||
                    `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}&size=200`
                  }
                  alt="profile"
                  className="profile-photo"
                />
                {isEditing && (
                  <button className="change-photo-btn">
                    <i className="fas fa-camera"></i>
                  </button>
                )}
              </div>

              <div className="profile-info-container">
                {isEditing ? (
                  <div className="edit-form">
                    <div className="edit-name-container">
                      <input
                        type="text"
                        name="firstName"
                        value={editedProfile.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="name-input"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={editedProfile.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="name-input"
                      />
                    </div>
                    <input
                      type="text"
                      name="profession"
                      value={editedProfile.profession}
                      onChange={handleChange}
                      placeholder="Headline"
                      className="headline-input"
                    />
                    <input
                      type="text"
                      name="location"
                      value={editedProfile.location}
                      onChange={handleChange}
                      placeholder="Location"
                      className="location-input"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="profile-name">{`${userProfile?.firstName} ${userProfile?.lastName}`}</h1>
                    <p className="profile-headline">
                      {userProfile?.profession || "Add your profession"}
                    </p>
                    <p className="profile-location">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {userProfile?.location || "Add location"}
                    </p>
                  </>
                )}
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <>
                    <button className="btn-save" onClick={handleSave}>
                      <i className="fas fa-check"></i> Save Changes
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      <i className="fas fa-times"></i> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-edit" onClick={handleEdit}>
                      <i className="fas fa-pen"></i> Edit Profile
                    </button>
                    <button className="btn-delete" onClick={handleDelete}>
                      <i className="fas fa-trash"></i> Delete Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div className="profile-card about-card">
              <h3>
                <i className="fas fa-user"></i> About
              </h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedProfile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="bio-input"
                />
              ) : (
                <p>{userProfile?.bio || "Add a bio to tell your story"}</p>
              )}
            </div>

            <div className="profile-card experience-card">
              <h3>
                <i className="fas fa-briefcase"></i> Experience
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={editedProfile.experience}
                  onChange={handleChange}
                  placeholder="Add your experience"
                  className="experience-input"
                />
              ) : (
                <div className="experience-list">
                  {userProfile?.experience ||
                    "Add your professional experience"}
                </div>
              )}
            </div>

            <div className="profile-card education-card">
              <h3>
                <i className="fas fa-graduation-cap"></i> Education
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  name="education"
                  value={editedProfile.education}
                  onChange={handleChange}
                  placeholder="Add your education"
                  className="education-input"
                />
              ) : (
                <div className="education-list">
                  {userProfile?.education || "Add your education"}
                </div>
              )}
            </div>

            <div className="profile-card skills-card">
              <h3>
                <i className="fas fa-code"></i> Skills
              </h3>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.skills?.join(", ")}
                  onChange={handleSkillsChange}
                  placeholder="Add skills (comma-separated)"
                  className="skills-input"
                />
              ) : (
                <div className="skills-container">
                  {userProfile?.skills?.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  )) || "Add your skills"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProfilePage;
