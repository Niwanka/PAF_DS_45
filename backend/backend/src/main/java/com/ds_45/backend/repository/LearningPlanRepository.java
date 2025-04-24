package com.ds_45.backend.repository;

import com.ds_45.backend.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    //  define custom queries if necessary (e.g., find by userId)
    // Optional: add other query methods like:
    // List<LearningPlan> findByUserId(String userId);
}
