package com.paf_45.bankendapplication.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
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
import com.paf_45.bankendapplication.model.LearningProgressUpdateResponse;
import com.paf_45.bankendapplication.service.LearningProgressUpdateService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/progress-updates")
public class LearningProgressUpdateController {

    @Autowired
    private LearningProgressUpdateService service;

    // Create new progress update with HATEOAS
    @PostMapping
    public ResponseEntity<LearningProgressUpdateResponse> create(@RequestBody LearningProgressUpdate update) {
        LearningProgressUpdate created = service.createUpdate(update);
        LearningProgressUpdateResponse response = new LearningProgressUpdateResponse(created);
        
        // Add self link
        Link selfLink = linkTo(methodOn(LearningProgressUpdateController.class)
                .getById(created.getId())).withSelfRel();
        response.add(selfLink);
        
        // Add link to all updates
        Link allUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                .getAll()).withRel("all-updates");
        response.add(allUpdatesLink);
        
        // Add link to user's updates
        Link userUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                .getByUserId(created.getUserId())).withRel("user-updates");
        response.add(userUpdatesLink);
        
        return ResponseEntity.ok(response);
    }

    // Get all progress updates with HATEOAS
    @GetMapping
    public ResponseEntity<CollectionModel<LearningProgressUpdateResponse>> getAll() {
        List<LearningProgressUpdate> updates = service.getAllUpdates();
        
        List<LearningProgressUpdateResponse> responses = updates.stream()
            .map(update -> {
                LearningProgressUpdateResponse response = new LearningProgressUpdateResponse(update);
                
                // Add self link
                Link selfLink = linkTo(methodOn(LearningProgressUpdateController.class)
                        .getById(update.getId())).withSelfRel();
                response.add(selfLink);
                
                // Add link to user's updates
                Link userUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                        .getByUserId(update.getUserId())).withRel("user-updates");
                response.add(userUpdatesLink);
                
                return response;
            })
            .collect(Collectors.toList());
        
        // Create collection model with links
        CollectionModel<LearningProgressUpdateResponse> collectionModel = CollectionModel.of(responses);
        
        // Add link to self (collection)
        collectionModel.add(linkTo(methodOn(LearningProgressUpdateController.class)
                .getAll()).withSelfRel());
        
        return ResponseEntity.ok(collectionModel);
    }

    // Get all updates by a specific user with HATEOAS
    @GetMapping("/user/{userId}")
    public ResponseEntity<CollectionModel<LearningProgressUpdateResponse>> getByUserId(@PathVariable String userId) {
        List<LearningProgressUpdate> updates = service.getUpdatesByUserId(userId);
        
        List<LearningProgressUpdateResponse> responses = updates.stream()
            .map(update -> {
                LearningProgressUpdateResponse response = new LearningProgressUpdateResponse(update);
                
                // Add self link
                Link selfLink = linkTo(methodOn(LearningProgressUpdateController.class)
                        .getById(update.getId())).withSelfRel();
                response.add(selfLink);
                
                // Add link to all updates
                Link allUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                        .getAll()).withRel("all-updates");
                response.add(allUpdatesLink);
                
                return response;
            })
            .collect(Collectors.toList());
        
        // Create collection model with links
        CollectionModel<LearningProgressUpdateResponse> collectionModel = CollectionModel.of(responses);
        
        // Add link to self (collection)
        collectionModel.add(linkTo(methodOn(LearningProgressUpdateController.class)
                .getByUserId(userId)).withSelfRel());
        
        // Add link to all updates
        collectionModel.add(linkTo(methodOn(LearningProgressUpdateController.class)
                .getAll()).withRel("all-updates"));
        
        return ResponseEntity.ok(collectionModel);
    }

    // Get a single progress update by ID with HATEOAS
    @GetMapping("/{id}")
    public ResponseEntity<LearningProgressUpdateResponse> getById(@PathVariable String id) {
        return service.getUpdateById(id)
                .map(update -> {
                    LearningProgressUpdateResponse response = new LearningProgressUpdateResponse(update);
                    
                    // Add self link
                    Link selfLink = linkTo(methodOn(LearningProgressUpdateController.class)
                            .getById(id)).withSelfRel();
                    response.add(selfLink);
                    
                    // Add link to all updates
                    Link allUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                            .getAll()).withRel("all-updates");
                    response.add(allUpdatesLink);
                    
                    // Add link to user's updates
                    Link userUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                            .getByUserId(update.getUserId())).withRel("user-updates");
                    response.add(userUpdatesLink);
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Update an existing progress update with HATEOAS
    @PutMapping("/{id}")
    public ResponseEntity<LearningProgressUpdateResponse> update(@PathVariable String id,
                                                         @RequestBody LearningProgressUpdate update) {
        return service.updateUpdate(id, update)
                .map(updatedData -> {
                    LearningProgressUpdateResponse response = new LearningProgressUpdateResponse(updatedData);
                    
                    // Add self link
                    Link selfLink = linkTo(methodOn(LearningProgressUpdateController.class)
                            .getById(id)).withSelfRel();
                    response.add(selfLink);
                    
                    // Add link to all updates
                    Link allUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                            .getAll()).withRel("all-updates");
                    response.add(allUpdatesLink);
                    
                    // Add link to user's updates
                    Link userUpdatesLink = linkTo(methodOn(LearningProgressUpdateController.class)
                            .getByUserId(updatedData.getUserId())).withRel("user-updates");
                    response.add(userUpdatesLink);
                    
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a progress update
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = service.deleteProgressUpdate(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 if deleted
        } else {
            return ResponseEntity.notFound().build();  // 404 if not found
        }
    }
}


