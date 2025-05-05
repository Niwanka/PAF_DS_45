package com.paf_45.bankendapplication.service;

import com.paf_45.bankendapplication.model.UserProfile;
import com.paf_45.bankendapplication.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public List<UserProfile> getAllUsers() {
        return userProfileRepository.findAll();
    }

    public Optional<UserProfile> getUserById(String userId) {
        return userProfileRepository.findById(userId);
    }

    public Optional<UserProfile> getUserProfile(String userId) {
        return userProfileRepository.findBySub(userId);
    }

    public UserProfile updateProfile(UserProfile profile) {
        profile.setUpdatedAt(LocalDateTime.now());
        return userProfileRepository.save(profile);
    }

    public void deleteProfile(String userId) {
        userProfileRepository.deleteBySub(userId);
    }
}