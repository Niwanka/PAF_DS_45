package com.ds_45.backend.controller;

import com.ds_45.backend.model.LearningPlan;
import com.ds_45.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    // Create a new Learning Plan
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan) {
        LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    // Get all Learning Plans
    @GetMapping
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanService.getAllLearningPlans();
    }

    // Get a Learning Plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        Optional<LearningPlan> plan = learningPlanService.getLearningPlanById(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Update a Learning Plan
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(
            @PathVariable String id, @RequestBody LearningPlan learningPlan) {
        LearningPlan updatedPlan = learningPlanService.updateLearningPlan(id, learningPlan);
        return updatedPlan != null ? new ResponseEntity<>(updatedPlan, HttpStatus.OK) :
                ResponseEntity.notFound().build();
    }

    // Delete a Learning Plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        boolean isDeleted = learningPlanService.deleteLearningPlan(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
