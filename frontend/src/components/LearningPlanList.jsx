const LearningPlanList = ({ plans }) => {
  return (
    <div className="plan-list">
      {plans.length === 0 ? (
        <p>No learning plans available. Create one now!</p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan.id}
            className="plan-card"
            style={{ marginBottom: "1rem" }}
          >
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default LearningPlanList;
