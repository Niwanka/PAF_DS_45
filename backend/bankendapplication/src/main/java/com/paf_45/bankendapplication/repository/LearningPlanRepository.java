package com.paf_45.bankendapplication.repository;

import com.paf_45.bankendapplication.model.LearningPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {

    // Find all learning plans for a specific user
    List<LearningPlan> findByUserId(String userId);

    // add more custom queries if needed
}
