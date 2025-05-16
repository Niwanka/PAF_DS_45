import React from "react";

const PlanModal = ({ isOpen, currentPlan, formData, setFormData, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addResource = () => {
    if (
      formData.newResource &&
      !formData.resources.includes(formData.newResource)
    ) {
      setFormData((prev) => ({
        ...prev,
        resources: [...prev.resources, prev.newResource],
        newResource: "",
      }));
    }
  };

  const removeResource = (resourceToRemove) => {
    setFormData((prev) => ({
      ...prev,
      resources: prev.resources.filter(
        (resource) => resource !== resourceToRemove
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "draft":
        return "status-draft";
      case "in-progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  // View-only mode is when we have a currentPlan but no title in formData
  const isViewMode = currentPlan && !formData.title;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {currentPlan ? (formData.title ? "Edit" : "View") : "Create"}{" "}
            Learning Plan
          </h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {isViewMode ? (
          // View mode
          <div className="view-content">
            <div className="view-group">
              <h3 className="view-title">{currentPlan.title}</h3>
              <p className="view-description">{currentPlan.description}</p>
            </div>

            <div className="view-group">
              <h4 className="view-subtitle">Details</h4>
              <p>
                <strong>Topics:</strong> {currentPlan.topics}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={getStatusStyle(currentPlan.status)}>
                  {currentPlan.status}
                </span>
              </p>
              {currentPlan.completionDate && (
                <p>
                  <strong>Target Completion:</strong>{" "}
                  {new Date(currentPlan.completionDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {currentPlan.resources?.length > 0 && (
              <div className="view-group">
                <h4 className="view-subtitle">Resources</h4>
                <ul className="view-resources-list">
                  {currentPlan.resources.map((resource, index) => (
                    <li key={index} className="view-resource-item">
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                      >
                        {resource.length > 50
                          ? `${resource.substring(0, 50)}...`
                          : resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          // Edit/Create mode
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="label">Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input"
                placeholder="Enter plan title"
              />
            </div>

            <div className="form-group">
              <label className="label">Description*</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="textarea"
                placeholder="Describe your learning plan"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="label">Topics</label>
              <input
                type="text"
                name="topics"
                value={formData.topics}
                onChange={handleInputChange}
                className="input"
                placeholder="Comma-separated list of topics"
              />
            </div>

            <div className="form-row">
              <div className="form-group form-group-flex">
                <label className="label">Completion Date</label>
                <input
                  type="date"
                  name="completionDate"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>

              <div className="form-group form-group-flex">
                <label className="label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Resources</label>
              <div className="resource-input-container">
                <input
                  type="url"
                  value={formData.newResource}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      newResource: e.target.value,
                    }))
                  }
                  placeholder="Add a resource URL"
                  className="resource-input"
                />
                <button
                  type="button"
                  className="add-resource-button"
                  onClick={addResource}
                >
                  Add
                </button>
              </div>
              <div className="resource-tags">
                {formData.resources.map((resource) => (
                  <div key={resource} className="resource-tag">
                    <span className="resource-tag-text">
                      {resource.length > 30
                        ? `${resource.substring(0, 30)}...`
                        : resource}
                    </span>
                    <button
                      type="button"
                      className="remove-resource-button"
                      onClick={() => removeResource(resource)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="submit-button">
                {currentPlan ? "Update" : "Create"} Plan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PlanModal;