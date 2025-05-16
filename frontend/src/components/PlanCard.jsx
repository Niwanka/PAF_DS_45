import React from "react";

const PlanCard = ({ plan, onView, onEdit, onDelete }) => {
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
    <div className="plan-card">
      <h3 className="plan-title">{plan.title}</h3>
      <p className="plan-description">{plan.description}</p>
      <div className="plan-meta">
        <p>
          <strong>Topics:</strong> {plan.topics}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={getStatusStyle(plan.status)}>{plan.status}</span>
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
        <button className="view-button" onClick={() => onView(plan)}>
          View
        </button>
        <button className="edit-button" onClick={() => onEdit(plan)}>
          Edit
        </button>
        <button className="delete-button" onClick={() => onDelete(plan.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlanCard;