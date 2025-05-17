package com.paf_45.bankendapplication.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_45.bankendapplication.model.LearningPlan;
import com.paf_45.bankendapplication.repository.LearningPlanRepository;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    // ✅ Create a new Learning Plan (sets createdAt automatically)
    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        learningPlan.setCreatedAt(LocalDateTime.now());
        return learningPlanRepository.save(learningPlan);
    }

    // ✅ Get all learning plans for a specific user
    public List<LearningPlan> getPlansByUserId(String userId) {
        return learningPlanRepository.findByUserId(userId);
    }

    // ✅ Get a specific learning plan by ID
    public Optional<LearningPlan> getLearningPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    // ✅ Update an existing learning plan
    public LearningPlan updateLearningPlan(String id, LearningPlan updatedPlan) {
        if (learningPlanRepository.existsById(id)) {
            updatedPlan.setId(id); // keep ID same
            return learningPlanRepository.save(updatedPlan);
        }
        return null;
    }

    // ✅ Delete a learning plan
    public boolean deleteLearningPlan(String id) {
        if (learningPlanRepository.existsById(id)) {
            learningPlanRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
