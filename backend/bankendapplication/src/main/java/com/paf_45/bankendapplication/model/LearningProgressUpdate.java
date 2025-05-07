package com.paf_45.bankendapplication.model;

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
    private String userId;

    //Fields for learning updates
    private String title;
    private String description;
    private TemplateType templateType;
    private String mediaUrl;
    private String skillLevel;
    private LocalDateTime dateCreated;
    private LocalDateTime lastUpdated;

     // No-args constructor
     public LearningProgressUpdate() {
    }

    // All-args constructor
    public LearningProgressUpdate(String id, String userId, String title, String description, 
                                  TemplateType templateType, String mediaUrl, String skillLevel,
                                  LocalDateTime dateCreated, LocalDateTime lastUpdated) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.templateType = templateType;
        this.mediaUrl = mediaUrl;
        this.skillLevel = skillLevel;
        this.dateCreated = dateCreated;
        this.lastUpdated = lastUpdated;
    }

    //getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public TemplateType getTemplateType() {
        return templateType;
    }
    
    public void setTemplateType(TemplateType templateType) {
        this.templateType = templateType;
    }
    
    public String getMediaUrl() {
        return mediaUrl;
    }
    
    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }
    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }
    public LocalDateTime getDateCreated() {
        return dateCreated;
    }
    
    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }
    
    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
    
    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    
    
    


}
