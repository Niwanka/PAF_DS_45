import React, { useState } from "react";
import axios from "axios";

function CreateLearningPlanForm() {
  const [formData, setFormData] = useState({
    userId: "",
    title: "",
    description: "",
    topics: "",
    completionDate: "",
    resources: [""],
    status: "draft",
  });

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "resources") {
      const updatedResources = [...formData.resources];
      updatedResources[index] = value;
      setFormData({ ...formData, resources: updatedResources });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addResourceField = () => {
    setFormData({ ...formData, resources: [...formData.resources, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/learning-plans", formData);
      alert("Learning plan created successfully!");
    } catch (error) {
      console.error("Error creating learning plan:", error);
      alert("Failed to create learning plan");
    }
  };

  return (
    <div>
      <h2>Create Learning Plan</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Topics:
          <input
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Completion Date:
          <input
            type="date"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Status:
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <br />

        <label>Resources:</label>
        <br />
        {formData.resources.map((res, index) => (
          <input
            key={index}
            type="text"
            name="resources"
            value={res}
            onChange={(e) => handleChange(e, index)}
            placeholder={`Resource URL ${index + 1}`}
          />
        ))}
        <br />
        <button type="button" onClick={addResourceField}>
          + Add Resource
        </button>
        <br />
        <br />

        <button type="submit">Create Plan</button>
      </form>
    </div>
  );
}

export default CreateLearningPlanForm;
