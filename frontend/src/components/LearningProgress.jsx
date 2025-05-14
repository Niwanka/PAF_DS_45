import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import ProgressCard from './ProgressCard';
import ProgressForm from './ProgressForm';
import './LearningProgressPage.css';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/progress-updates';

// Map frontend types to backend TemplateType enum
const templateTypeMap = {
  'tutorial': 'TUTORIAL',
  'skill': 'SKILL',
  'milestone': 'MILESTONE',
  'project': 'PROJECT',
  'workshop': 'WORKSHOP'
};

// Map backend TemplateType enum to frontend types
const reverseTemplateTypeMap = {
  'TUTORIAL': 'tutorial',
  'SKILL': 'skill',
  'MILESTONE': 'milestone',
  'PROJECT': 'project',
  'WORKSHOP': 'workshop'
};

const LearningProgress = () => {
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('tutorial');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    type: 'tutorial',
    description: '',
    completionDate: new Date().toISOString().split('T')[0],
    mediaUrl: '',
    skillLevel: 'beginner',
    userId: 'current-user-id',
  });

  const templates = {
    tutorial: {
      title: 'Tutorial Completed',
      type: 'tutorial',
      description: '',
      completionDate: new Date().toISOString().split('T')[0],
      mediaUrl: '',
      skillLevel: 'beginner',
    },
    skill: {
      title: 'New Skill Learned',
      type: 'skill',
      description: '',
      completionDate: new Date().toISOString().split('T')[0],
      mediaUrl: '',
      skillLevel: 'beginner',
    },
    milestone: {
      title: 'Learning Milestone',
      type: 'milestone',
      description: '',
      completionDate: new Date().toISOString().split('T')[0],
      mediaUrl: '',
      skillLevel: 'intermediate',
    },
    project: {
      title: 'Project Completed',
      type: 'project',
      description: '',
      completionDate: new Date().toISOString().split('T')[0],
      mediaUrl: '',
      skillLevel: 'advanced',
    },
    workshop: {
      title: 'Joined Workshop',
      type: 'workshop',
      description: '',
      completionDate: new Date().toISOString().split('T')[0],
      mediaUrl: '',
      skillLevel: 'intermediate',
    },
  };

  // Convert backend model to frontend model
  const convertToFrontendModel = (backendUpdate) => {
    return {
      id: backendUpdate.id,
      title: backendUpdate.title,
      type: reverseTemplateTypeMap[backendUpdate.templateType] || 'tutorial',
      description: backendUpdate.description,
      completionDate: backendUpdate.dateCreated ? new Date(backendUpdate.dateCreated).toISOString().split('T')[0] : '',
      resourceLink: backendUpdate.mediaUrl,
      projectLink: backendUpdate.mediaUrl,
      skillLevel: backendUpdate.skillLevel || 'beginner',
      createdAt: backendUpdate.dateCreated,
      userId: backendUpdate.userId
    };
  };

  // Convert frontend model to backend model
  const convertToBackendModel = (frontendUpdate) => {
    return {
      id: frontendUpdate.id,
      userId: frontendUpdate.userId || 'current-user-id',
      title: frontendUpdate.title,
      description: frontendUpdate.description,
      templateType: templateTypeMap[frontendUpdate.type] || 'TUTORIAL',
      mediaUrl: frontendUpdate.resourceLink || frontendUpdate.projectLink || '',
      skillLevel: frontendUpdate.skillLevel,
      dateCreated: frontendUpdate.id ? undefined : new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  };

  useEffect(() => {
    fetchProgressUpdates();
  }, []);

  const fetchProgressUpdates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      const updates = response.data._embedded ? 
                      response.data._embedded.learningProgressUpdateResponseList : [];
      const frontendUpdates = updates.map(convertToFrontendModel);
      setProgressUpdates(frontendUpdates);
      setError(null);
    } catch (err) {
      console.error('Error fetching progress updates:', err);
      setError('Failed to fetch progress updates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000); // Notification disappears after 3 seconds
  };

  const handleSubmit = async (formData) => {
    try {
      const backendModel = convertToBackendModel(formData);
      
      if (editMode && formData.id) {
        await axios.put(`${API_BASE_URL}/${formData.id}`, backendModel);
        showNotification('Progress update edited successfully!');
      } else {
        await axios.post(API_BASE_URL, backendModel);
        showNotification('Progress update created successfully!');
      }
      
      fetchProgressUpdates();
      setNewUpdate(templates[activeTemplate]);
      setEditMode(false);
      setShowModal(false);
    } catch (err) {
      console.error('Error saving progress update:', err);
      setError('Failed to save progress update. Please try again later.');
    }
  };

  const handleEdit = (update) => {
    setEditMode(true);
    setNewUpdate({
      ...update,
      type: update.type
    });
    setActiveTemplate(update.type);
    setShowModal(true);
  };

  const handleDeleteConfirm = (id) => {
    setDeleteItemId(id);
    setShowConfirmDialog(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/${deleteItemId}`);
      setProgressUpdates((prev) => prev.filter((update) => update.id !== deleteItemId));
      setShowConfirmDialog(false);
      setDeleteItemId(null);
      showNotification('Progress update deleted successfully!');
    } catch (err) {
      console.error('Error deleting progress update:', err);
      setError('Failed to delete progress update. Please try again later.');
    }
  };

  const handleTemplateChange = (templateType) => {
    setActiveTemplate(templateType);
    setNewUpdate(prev => ({
      ...templates[templateType],
      id: editMode ? prev.id : undefined,
      userId: prev.userId
    }));
  };

  const filteredUpdates = progressUpdates.filter(
    (update) =>
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="progress-container">
      <div className="header-section">
        <h1 className="main-title">Learning Progress Updates</h1>
        <div className="search-actions">
          <div className="search-container">
            <div className="search-icon">
              <Search className="icon-search" />
            </div>
            <input
              type="text"
              placeholder="Search learning updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            onClick={() => {
              setEditMode(false);
              setNewUpdate({
                ...templates[activeTemplate],
                userId: 'current-user-id'
              });
              setShowModal(true);
            }}
            className="add-button"
          >
            <Plus className="icon-small" />
            Create Progress Update
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* Error message display */}
      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => setError(null)} className="error-dismiss">Dismiss</button>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <button 
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              <X className="icon-close" />
            </button>
            <h2 className="modal-title">{editMode ? 'Edit' : 'Add'} Learning Progress</h2>
            <ProgressForm 
              formData={newUpdate}
              activeTemplate={activeTemplate}
              onSubmit={handleSubmit}
              onTemplateChange={handleTemplateChange}
              editMode={editMode}
            />
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {showConfirmDialog && (
        <div className="modal-backdrop">
          <div className="confirm-dialog">
            <h3 className="confirm-title">Delete Confirmation</h3>
            <p className="confirm-message">Are you sure you want to delete this progress update?</p>
            <div className="confirm-actions">
              <button 
                onClick={() => setShowConfirmDialog(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Updates Cards */}
      <div className="updates-container">
        <h2 className="section-title">Your Learning Journey</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredUpdates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <div className="icon-large"></div>
            </div>
            <p className="empty-title">No progress updates found</p>
            <p className="empty-message">Start tracking your learning journey by adding a progress update!</p>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredUpdates.map((update) => (
              <ProgressCard 
                key={update.id}
                update={update}
                onEdit={handleEdit}
                onDeleteConfirm={handleDeleteConfirm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgress;