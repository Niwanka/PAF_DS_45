import React, { useEffect, useState } from "react";
import axios from "axios";

function LearningPlanPage() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/learning-plans")
      .then((res) => {
        console.log("✅ Plans received:", res.data);
        setPlans(res.data); // <- this is correct
      })
      .catch((err) => {
        console.error("❌ Error fetching plans:", err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Learning Plans</h2>

      <button style={{ marginBottom: "20px" }}>Create Learning Plan</button>

      {Array.isArray(plans) && plans.length > 0 ? (
        plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>{plan.title}</h3>
            <p>
              <strong>Description:</strong> {plan.description}
            </p>
            <p>
              <strong>Topics:</strong> {plan.topics}
            </p>
            <p>
              <strong>Completion Date:</strong> {plan.completionDate}
            </p>
            <p>
              <strong>Status:</strong> {plan.status ?? "Not set"}
            </p>
            {plan.resources && plan.resources.length > 0 && (
              <p>
                <strong>Resources:</strong> {plan.resources.join(", ")}
              </p>
            )}

            <button>Edit</button>
            <button style={{ marginLeft: "10px" }}>Delete</button>
          </div>
        ))
      ) : (
        <p>No learning plans found.</p>
      )}
    </div>
  );
}

export default LearningPlanPage;
