package com.ds_45.backend.service;

import com.ds_45.backend.model.LearningPlan;
import com.ds_45.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    // Create a new Learning Plan
    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return learningPlanRepository.save(learningPlan);
    }

    // Get all Learning Plans
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanRepository.findAll();
    }

    // Get a specific Learning Plan by ID
    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    // Update an existing Learning Plan
    public LearningPlan updateLearningPlan(String id, LearningPlan updatedPlan) {
        if (learningPlanRepository.existsById(id)) {
            updatedPlan.setId(id);
            return learningPlanRepository.save(updatedPlan);
        }
        return null;
    }

    // Delete a Learning Plan
    public boolean deleteLearningPlan(String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
