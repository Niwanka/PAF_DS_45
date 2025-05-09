import React, { useState, useEffect } from "react";
import axios from "axios";

const LearningPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const response = await axios.post("/api/learning-plans", {
        title: formData.title,
        description: formData.description,
        topics: formData.topics,
        completionDate: formData.completionDate,
        resources: formData.resources,
        status: formData.status,
      });
      setPlans((prev) => [...prev, response.data]);
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        topics: "",
        completionDate: "",
        resources: [],
        newResource: "",
        status: "draft",
      });
    } catch (error) {
      console.error("Failed to create learning plan", error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>My Learning Plans</h1>
        <button
          style={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create New Plan
        </button>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading plans...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : plans.length > 0 ? (
        <div style={styles.plansGrid}>
          {plans.map((plan) => (
            <div key={plan.id} style={styles.planCard}>
              <h3 style={styles.planTitle}>{plan.title}</h3>
              <p style={styles.planDescription}>{plan.description}</p>
              <div style={styles.planMeta}>
                <p>
                  <strong>Topics:</strong> {plan.topics}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={getStatusStyle(plan.status)}>{plan.status}</span>
                </p>
                {plan.completionDate && (
                  <p>
                    <strong>Target Completion:</strong>{" "}
                    {new Date(plan.completionDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              {plan.resources?.length > 0 && (
                <div style={styles.resourcesContainer}>
                  <strong>Resources:</strong>
                  <ul style={styles.resourcesList}>
                    {plan.resources.map((resource, index) => (
                      <li key={index} style={styles.resourceItem}>
                        <a
                          href={resource}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.resourceLink}
                        >
                          Resource {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>You don't have any learning plans yet.</p>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Create New Learning Plan</h2>
              <button
                style={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Enter plan title"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={styles.textarea}
                  placeholder="Describe your learning plan"
                  rows={4}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Topics</label>
                <input
                  type="text"
                  name="topics"
                  value={formData.topics}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Comma-separated list of topics"
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Completion Date</label>
                  <input
                    type="date"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>

                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={styles.input}
                  >
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Resources</label>
                <div style={styles.resourceInputContainer}>
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
                    style={styles.resourceInput}
                  />
                  <button
                    type="button"
                    style={styles.addResourceButton}
                    onClick={addResource}
                  >
                    Add
                  </button>
                </div>
                <div style={styles.resourceTags}>
                  {formData.resources.map((resource) => (
                    <div key={resource} style={styles.resourceTag}>
                      <span style={styles.resourceTagText}>
                        {resource.length > 30
                          ? `${resource.substring(0, 30)}...`
                          : resource}
                      </span>
                      <button
                        type="button"
                        style={styles.removeResourceButton}
                        onClick={() => removeResource(resource)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.formActions}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced styles
const styles = {
  page: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  createButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#4338ca",
      transform: "translateY(-1px)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  planCard: {
    backgroundColor: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    ":hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
  },
  planTitle: {
    marginTop: "0",
    marginBottom: "12px",
    color: "#1e293b",
    fontSize: "18px",
    fontWeight: "600",
  },
  planDescription: {
    marginBottom: "16px",
    color: "#64748b",
    fontSize: "14px",
  },
  planMeta: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "16px",
    " p": {
      margin: "4px 0",
    },
  },
  resourcesContainer: {
    marginTop: "12px",
  },
  resourcesList: {
    margin: "8px 0 0 0",
    paddingLeft: "20px",
  },
  resourceItem: {
    marginBottom: "4px",
  },
  resourceLink: {
    color: "#4f46e5",
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    color: "#64748b",
  },
  loading: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },
  error: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    color: "#b91c1c",
  },
  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
    boxSizing: "border-box",
    overflowY: "auto",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
    padding: "4px",
    ":hover": {
      color: "#1e293b",
    },
  },
  form: {
    padding: "24px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formRow: {
    display: "flex",
    gap: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#334155",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
    ":focus": {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "14px",
    minHeight: "100px",
    resize: "vertical",
    transition: "border-color 0.2s ease",
    ":focus": {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },
  resourceInputContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  resourceInput: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "border-color 0.2s ease",
    ":focus": {
      outline: "none",
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
    },
  },
  addResourceButton: {
    backgroundColor: "#e0e7ff",
    color: "#4f46e5",
    border: "none",
    borderRadius: "6px",
    padding: "0 16px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#c7d2fe",
    },
  },
  resourceTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  resourceTag: {
    backgroundColor: "#e0e7ff",
    borderRadius: "4px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  resourceTagText: {
    color: "#4f46e5",
    fontSize: "12px",
    maxWidth: "120px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  removeResourceButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#4f46e5",
    cursor: "pointer",
    fontSize: "14px",
    padding: "0",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  cancelButton: {
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#e2e8f0",
    },
  },
  submitButton: {
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s ease",
    ":hover": {
      backgroundColor: "#4338ca",
    },
  },
};

const getStatusStyle = (status) => {
  switch (status) {
    case "draft":
      return {
        color: "#64748b",
        backgroundColor: "#f1f5f9",
        padding: "2px 8px",
        borderRadius: "4px",
      };
    case "in-progress":
      return {
        color: "#9a3412",
        backgroundColor: "#ffedd5",
        padding: "2px 8px",
        borderRadius: "4px",
      };
    case "completed":
      return {
        color: "#166534",
        backgroundColor: "#dcfce7",
        padding: "2px 8px",
        borderRadius: "4px",
      };
    default:
      return {};
  }
};

export default LearningPlanPage;
