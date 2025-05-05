package com.paf_45.bankendapplication.controller;

import com.paf_45.bankendapplication.model.UserProfile;
import com.paf_45.bankendapplication.service.UserProfileService;
import com.paf_45.bankendapplication.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private AuthService authService;

    // Get current user's profile
    @GetMapping
    public ResponseEntity<UserProfile> getCurrentUserProfile() {
        String userId = authService.getCurrentUserId();
        return userProfileService.getUserProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update current user's profile
    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile updatedProfile) {
        String userId = authService.getCurrentUserId();
        return userProfileService.getUserProfile(userId)
                .map(existingProfile -> {
                    updatedProfile.setId(existingProfile.getId());
                    updatedProfile.setSub(existingProfile.getSub());
                    updatedProfile.setEmail(existingProfile.getEmail());
                    updatedProfile.setEmailVerified(existingProfile.isEmailVerified());
                    return ResponseEntity.ok(userProfileService.updateProfile(updatedProfile));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete current user's profile
    @DeleteMapping
    public ResponseEntity<Void> deleteProfile() {
        String userId = authService.getCurrentUserId();
        return userProfileService.getUserProfile(userId)
                .map(profile -> {
                    userProfileService.deleteProfile(userId);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}