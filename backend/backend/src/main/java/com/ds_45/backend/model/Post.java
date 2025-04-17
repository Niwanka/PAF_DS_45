package com.ds_45.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id; 

    private String userId;
    private String title;  
    private String content;  
    private List<String> tags;  
    private List<String> mediaUrls; 
    private List<String> likes;  
    private LocalDateTime createdAt; 
    private LocalDateTime updatedAt;  
}
