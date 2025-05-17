import React, { useState, useEffect } from "react";
import axios from "axios";
import PlanCard from "./PlanCard";
import PlanModal from "./PlanModal";
import "../styles/LearningPlanPage.css";
import Navbar from "./Navbar";
import Swal from 'sweetalert2';


const LearningPlanPage = ({ userProfile }) => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topics: "",
    completionDate: "",
    resources: [],
    newResource: "",
    status: "draft",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch learning plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/learning-plans", {
          withCredentials: true,
        });
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this learning plan?")) {
      try {
        await axios.delete(`/api/learning-plans/${id}`, {
          withCredentials: true,
        });
        setPlans((prev) => prev.filter((plan) => plan.id !== id));
      } catch (error) {
        console.error("Failed to delete learning plan", error);
      }
    }
  };

  const handleSubmit = async (formData, currentPlan) => {
    try {
      if (currentPlan) {
        const response = await axios.put(
          `/api/learning-plans/${currentPlan.id}`,
          {
            title: formData.title,
            description: formData.description,
            topics: formData.topics,
            completionDate: formData.completionDate,
            resources: formData.resources,
            status: formData.status,
          },
          {
            withCredentials: true,
          }
        );
        setPlans((prev) =>
          prev.map((plan) =>
            plan.id === currentPlan.id ? response.data : plan
          )
        );
      } else {
        const response = await axios.post(
          "/api/learning-plans",
          {
            title: formData.title,
            description: formData.description,
            topics: formData.topics,
            completionDate: formData.completionDate,
            resources: formData.resources,
            status: formData.status,
          },
          {
            withCredentials: true,
          }
        );
        setPlans((prev) => [...prev, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Failed to save learning plan", error);
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

  // 🔍 Search logic: filters based on multiple fields
  const filteredPlans = plans.filter((plan) => {
    const resourceText = Array.isArray(plan.resources)
      ? plan.resources.join(" ")
      : "";
    const searchableText = `${plan.title} ${plan.topics} ${plan.description} ${plan.status} ${resourceText}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <Navbar userProfile={userProfile} />

      <div className="page">
        <div className="header">
          <h1>My Learning Plans</h1>
          <button className="create-button" onClick={openCreateModal}>
            Create New Plan
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search title, topic, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {isLoading ? (
          <div className="loading">Loading plans...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredPlans.length > 0 ? (
          <div className="plans-grid">
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No matching learning plans found.</p>
          </div>
        )}

        {isModalOpen && (
          <PlanModal
            isOpen={isModalOpen}
            currentPlan={currentPlan}
            formData={formData}
            setFormData={setFormData}
            onClose={closeModal}
            onSubmit={(data) => handleSubmit(data, currentPlan)}
          />
        )}
      </div>
    </div>
  );
};

export default LearningPlanPage;
