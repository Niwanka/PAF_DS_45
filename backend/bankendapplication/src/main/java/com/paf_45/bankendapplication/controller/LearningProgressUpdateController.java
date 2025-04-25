package com.paf_45.bankendapplication.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_45.bankendapplication.model.LearningProgressUpdate;
import com.paf_45.bankendapplication.service.LearningProgressUpdateService;


@RestController
@RequestMapping("/api/progress-updates")
public class LearningProgressUpdateController {

    @Autowired
    private LearningProgressUpdateService service;

    // Create new progress update
    @PostMapping
      public ResponseEntity<LearningProgressUpdate> create(@RequestBody LearningProgressUpdate update) {
        LearningProgressUpdate created = service.createUpdate(update);
        return ResponseEntity.ok(created);
    }

    // Get all progress updates
    @GetMapping
    public ResponseEntity<List<LearningProgressUpdate>> getAll() {
        return ResponseEntity.ok(service.getAllUpdates());
    }

    // Get all updates by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningProgressUpdate>> getByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(service.getUpdatesByUserId(userId));
    }

    // Get a single progress update by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearningProgressUpdate> getById(@PathVariable String id) {
        return service.getUpdateById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing progress update
    @PutMapping("/{id}")
    public ResponseEntity<LearningProgressUpdate> update(@PathVariable String id,
                                                         @RequestBody LearningProgressUpdate update) {
        return service.updateUpdate(id, update)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a progress update
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteUpdate(id);
        return ResponseEntity.noContent().build();
    }


}


