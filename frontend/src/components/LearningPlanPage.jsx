import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LearningPlanPage.css";

const LearningPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null); // Track the plan being viewed/edited
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topics: "",
    completionDate: "",
    resources: [],
    newResource: "",
    status: "draft",
  });

  // Fetch learning plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/learning-plans");
        setPlans(Array.isArray(response?.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch learning plans", err);
        setError("Failed to load learning plans");
        setPlans([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Debug logging for modal state
  useEffect(() => {
    console.log("Modal open state:", isModalOpen);
  }, [isModalOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPlan) {
        // Update existing plan
        const response = await axios.put(
          `/api/learning-plans/${currentPlan.id}`,
          {
            title: formData.title,
            description: formData.description,
            topics: formData.topics,
            completionDate: formData.completionDate,
            resources: formData.resources,
            status: formData.status,
          }
        );
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === currentPlan.id ? response.data : plan
          )
        );
      } else {
        // Create new plan
        const response = await axios.post("/api/learning-plans", {
          title: formData.title,
          description: formData.description,
          topics: formData.topics,
          completionDate: formData.completionDate,
          resources: formData.resources,
          status: formData.status,
        });
        setPlans((prev) => [...prev, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save learning plan", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this learning plan?")) {
      try {
        await axios.delete(`/api/learning-plans/${id}`);
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
      } catch (error) {
        console.error("Failed to delete learning plan", error);
      }
    }
  };

  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      topics: plan.topics,
      completionDate: plan.completionDate || "",
      resources: plan.resources || [],
      newResource: "",
      status: plan.status || "draft",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (plan) => {
    setCurrentPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPlan(null);
    setFormData({
      title: "",
      description: "",
      topics: "",
      completionDate: "",
      resources: [],
      newResource: "",
      status: "draft",
    });
  };

  const openCreateModal = () => {
    setCurrentPlan(null);
    setFormData({
      title: "",
      description: "",
      topics: "",
      completionDate: "",
      resources: [],
      newResource: "",
      status: "draft",
    });
    setIsModalOpen(true);
    console.log("Create modal triggered");
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

  return (
    <div className="page">
      <div className="header">
        <h1>My Learning Plans</h1>
        <button className="create-button" onClick={openCreateModal}>
          Create New Plan
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading plans...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : plans.length > 0 ? (
        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3 className="plan-title">{plan.title}</h3>
              <p className="plan-description">{plan.description}</p>
              <div className="plan-meta">
                <p>
                  <strong>Topics:</strong> {plan.topics}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusStyle(plan.status)}>
                    {plan.status}
                  </span>
                </p>
                {plan.completionDate && (
                  <p>
                    <strong>Target Completion:</strong>{" "}
                    {new Date(plan.completionDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {plan.resources?.length > 0 && (
                <div className="resources-container">
                  <strong>Resources:</strong>
                  <ul className="resources-list">
                    {plan.resources.map((resource, index) => (
                      <li key={index} className="resource-item">
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-link"
                        >
                          Resource {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="card-actions">
                <button
                  className="view-button"
                  onClick={() => openViewModal(plan)}
                >
                  View
                </button>
                <button
                  className="edit-button"
                  onClick={() => openEditModal(plan)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You don't have any learning plans yet.</p>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {currentPlan ? (formData.title ? "Edit" : "View") : "Create"}{" "}
                Learning Plan
              </h2>
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
            </div>

            {currentPlan && !formData.title ? (
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
                      {new Date(
                        currentPlan.completionDate
                      ).toLocaleDateString()}
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
                    disabled={currentPlan && !formData.title}
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
                    disabled={currentPlan && !formData.title}
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
                    disabled={currentPlan && !formData.title}
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
                      disabled={currentPlan && !formData.title}
                    />
                  </div>

                  <div className="form-group form-group-flex">
                    <label className="label">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input"
                      disabled={currentPlan && !formData.title}
                    >
                      <option value="draft">Draft</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Resources</label>
                  {!(currentPlan && !formData.title) && (
                    <>
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
                    </>
                  )}
                </div>

                {!(currentPlan && !formData.title) && (
                  <div className="form-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="submit-button">
                      {currentPlan ? "Update" : "Create"} Plan
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPlanPage;
