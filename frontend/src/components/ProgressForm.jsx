import React, { useState, useEffect } from 'react';

const ProgressForm = ({ formData, activeTemplate, onSubmit, onTemplateChange, editMode }) => {
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = e.target.value;
    onTemplateChange(selectedTemplate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          name="title"
          placeholder="What did you learn?"
          value={localFormData.title}
          onChange={handleInputChange}
          className="form-input"
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          placeholder="Describe what you learned..."
          value={localFormData.description}
          onChange={handleInputChange}
          rows="3"
          className="form-textarea"
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Choose Template</label>
        <select 
          value={activeTemplate} 
          onChange={handleTemplateChange}
          className="form-select"
        >
          <option value="tutorial">Tutorial Completed</option>
          <option value="skill">New Skill Learned</option>
          <option value="milestone">Learning Milestone</option>
          <option value="project">Project Completed</option>
          <option value="workshop">Joined Workshop</option>
        </select>
      </div>
      
      {(activeTemplate === 'tutorial' || activeTemplate === 'skill') && (
        <div className="form-group">
          <label className="form-label">Resource Link</label>
          <input
            type="url"
            name="resourceLink"
            placeholder="Link to the resource"
            value={localFormData.resourceLink || ''}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
      )}
      
      {(activeTemplate === 'project' || activeTemplate === 'workshop') && (
        <div className="form-group">
          <label className="form-label">Project Link</label>
          <input
            type="url"
            name="projectLink"
            placeholder="Link to the project"
            value={localFormData.projectLink || ''}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">Skill Level</label>
        <select 
          name="skillLevel"
          value={localFormData.skillLevel}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      
      <div className="form-submit">
        <button 
          type="submit" 
          className="submit-button"
        >
          {editMode ? 'Update' : 'Add'} Progress
        </button>
      </div>
    </form>
  );
};

export default ProgressForm;