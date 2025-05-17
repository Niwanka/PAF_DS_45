package com.paf_45.bankendapplication.controller;

import com.paf_45.bankendapplication.model.LearningPlan;
import com.paf_45.bankendapplication.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
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

    //  Create a new learning plan (assign to logged-in user)
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlan learningPlan,
                                                           @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub"); // or "email"
        learningPlan.setUserId(userId);
        LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    // Get all learning plans for the logged-in user
    @GetMapping
    public List<LearningPlan> getUserLearningPlans(@AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        return learningPlanService.getPlansByUserId(userId);
    }

    // Get a specific learning plan (must belong to logged-in user)
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id,
                                                            @AuthenticationPrincipal OAuth2User principal) {
        Optional<LearningPlan> plan = learningPlanService.getLearningPlanById(id);
        String userId = principal.getAttribute("sub");

        return plan.isPresent() && userId.equals(plan.get().getUserId())
                ? ResponseEntity.ok(plan.get())
                : ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // Update a learning plan (only if owned by user)
    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable String id,
                                                           @RequestBody LearningPlan updatedPlan,
                                                           @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        Optional<LearningPlan> existingPlan = learningPlanService.getLearningPlanById(id);

        if (existingPlan.isPresent() && userId.equals(existingPlan.get().getUserId())) {
            updatedPlan.setUserId(userId);
            LearningPlan saved = learningPlanService.updateLearningPlan(id, updatedPlan);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    //  Delete a learning plan (only if owned by user)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id,
                                                   @AuthenticationPrincipal OAuth2User principal) {
        Optional<LearningPlan> plan = learningPlanService.getLearningPlanById(id);
        String userId = principal.getAttribute("sub");

        if (plan.isPresent() && userId.equals(plan.get().getUserId())) {
            learningPlanService.deleteLearningPlan(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
}
