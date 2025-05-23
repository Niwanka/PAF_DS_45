package com.paf_45.bankendapplication.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
//import java.time.LocalDateTime;

@Data
@Document(collection = "learning_plans")
public class LearningPlan {

    @Id
    private String id; // MongoDB unique identifier

    private String userId; // The user associated with the learning plan
    private String title; // The title of the learning plan
    private String description; // The detailed description of the learning plan
    private String topics; // A list of topics covered in the learning plan
    private LocalDateTime createdAt;    // Timestamp of when the learning plan was created
    private String completionDate; // Target date for completing the learning plan
    //private LocalDateTime createdAt; // Timestamp of when the learning plan was created
    //private LocalDateTime updatedAt; // Timestamp of the last update to the learning plan

    private List<String> resources;     // List of URLs
    private String status;              // e.g., "draft", "in-progress", "completed"
    

    // Additional fields 
    
}
