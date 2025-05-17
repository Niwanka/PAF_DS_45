import React from "react";
import { jsPDF } from "jspdf"; // ✅ import jsPDF

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

  // ✅ Function to generate and download PDF
  const downloadPlanAsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(plan.title || "Untitled Plan", 10, 20);

    doc.setFontSize(12);
    doc.text(`Description: ${plan.description || "N/A"}`, 10, 30);
    doc.text(`Topics: ${plan.topics || "N/A"}`, 10, 40);
    doc.text(`Status: ${plan.status || "N/A"}`, 10, 50);
    doc.text(
      `Completion Date: ${
        plan.completionDate
          ? new Date(plan.completionDate).toLocaleDateString()
          : "N/A"
      }`,
      10,
      60
    );

    if (plan.resources && plan.resources.length > 0) {
      doc.text("Resources:", 10, 70);
      plan.resources.forEach((res, i) => {
        doc.text(`${i + 1}. ${res}`, 15, 80 + i * 10);
      });
    }

    doc.save(`${plan.title || "learning-plan"}.pdf`);
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
        {/* ✅ New button for PDF download */}
        <button className="download-button" onClick={downloadPlanAsPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
