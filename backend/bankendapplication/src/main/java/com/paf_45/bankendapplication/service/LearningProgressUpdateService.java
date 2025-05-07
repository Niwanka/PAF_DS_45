package com.paf_45.bankendapplication.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_45.bankendapplication.model.LearningProgressUpdate;
import com.paf_45.bankendapplication.repository.LearningProgressUpdateRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LearningProgressUpdateService {

    @Autowired
    private LearningProgressUpdateRepository repository;

      // Create a new progress update
      public LearningProgressUpdate createUpdate(LearningProgressUpdate update) {
        update.setDateCreated(LocalDateTime.now());
        update.setLastUpdated(LocalDateTime.now());
        return repository.save(update);
    }

     // Get all progress updates
    public List<LearningProgressUpdate> getAllUpdates() {
        return repository.findAll();
    }

    // Get progress updates by user ID
    public List<LearningProgressUpdate> getUpdatesByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    // Get a specific progress update by ID
    public Optional<LearningProgressUpdate> getUpdateById(String id) {
        return repository.findById(id);
    }

    // Update an exsiting progress update
    public Optional<LearningProgressUpdate> updateUpdate(String id, LearningProgressUpdate updatedData) {
        Optional<LearningProgressUpdate> existingOpt = repository.findById(id);
        if (existingOpt.isPresent()) {
            LearningProgressUpdate existing = existingOpt.get();
            existing.setTitle(updatedData.getTitle());
            existing.setDescription(updatedData.getDescription());
            existing.setTemplateType(updatedData.getTemplateType());
            existing.setMediaUrl(updatedData.getMediaUrl());
            existing.setSkillLevel(updatedData.getSkillLevel());
            existing.setLastUpdated(LocalDateTime.now());
            return Optional.of(repository.save(existing));
        }
        return Optional.empty();
    }

    // Delete a progress update
    public boolean deleteProgressUpdate(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;  // Deleted successfully
        } else {
            return false; // Nothing to delete
        }
    }
    


}


