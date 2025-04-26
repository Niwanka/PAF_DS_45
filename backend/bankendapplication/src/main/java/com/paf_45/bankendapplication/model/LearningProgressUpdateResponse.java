package com.paf_45.bankendapplication.model;

import org.springframework.hateoas.RepresentationModel;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LearningProgressUpdateResponse extends RepresentationModel<LearningProgressUpdateResponse> {
    private String id;
    private String userId;
    private String title;
    private String description;
    private TemplateType templateType;
    private String mediaUrl;
    private LocalDateTime dateCreated;
    private LocalDateTime lastUpdated;

    // Constructors
    public LearningProgressUpdateResponse() {
    }

    public LearningProgressUpdateResponse(LearningProgressUpdate update) {
        this.id = update.getId();
        this.userId = update.getUserId();
        this.title = update.getTitle();
        this.description = update.getDescription();
        this.templateType = update.getTemplateType();
        this.mediaUrl = update.getMediaUrl();
        this.dateCreated = update.getDateCreated();
        this.lastUpdated = update.getLastUpdated();
    }

    // Getters and setters
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