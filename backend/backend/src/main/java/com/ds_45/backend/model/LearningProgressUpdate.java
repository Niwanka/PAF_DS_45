package com.ds_45.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

import lombok.Data;

@Data
@Document(collection = "learning_progress_updates")
public class LearningProgressUpdate {

    @Id
    private String id;

    //User associated with this update
    private String userID;

    //Fields for learning updates
    private String title;
    private String description;
    private TemplateType templateType;
    private String mediaUrl;
    private LocalDateTime dateCreated;
    private LocalDateTime lastUpdated;
    

}
