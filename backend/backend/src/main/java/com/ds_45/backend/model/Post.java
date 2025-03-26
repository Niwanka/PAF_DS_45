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
    private String id;  // Unique post ID (MongoDB ObjectId)

    private String userId; // The author of the post
    private String title;  // Post title
    private String content;  // Post description
    private List<String> tags;  // Tags for categorization
    private List<String> mediaUrls; // Image/Video URLs (stored in Firebase)
    private List<String> likes;  // List of user IDs who liked the post
    private LocalDateTime createdAt;  // Post creation time
    private LocalDateTime updatedAt;  // Last update time
}
