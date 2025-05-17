package com.paf_45.bankendapplication.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Service;

import com.paf_45.bankendapplication.model.Post;
import com.paf_45.bankendapplication.repository.PostRepository;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private NotificationService notificationService;

    // Fetch all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Fetch a single post by ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // Fetch all posts by a specific user
    public List<Post> getPostsByUser(String userId) {
        try {
            // Sort posts by creation date in descending order (newest first)
            Sort sortByCreatedAtDesc = Sort.by(Direction.DESC, "createdAt");
            return postRepository.findByUserId(userId, sortByCreatedAtDesc);
        } catch (Exception e) {
            // Log the error
            System.err.println("Error fetching posts for user " + userId + ": " + e.getMessage());
            return new ArrayList<>(); // Return empty list instead of null
        }
    }


    // Create a new post
    public Post createPost(Post post) {
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    // Update an existing post
    public Post updatePost(String id, Post updatedPost) {
        return postRepository.findById(id).map(post -> {
            post.setTitle(updatedPost.getTitle());
            post.setContent(updatedPost.getContent());
            post.setTags(updatedPost.getTags());
            post.setMediaUrls(updatedPost.getMediaUrls()); 
            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }).orElse(null);
    }

    // Delete a post
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    // Toggle like on a post
    public Optional<Post> toggleLike(String postId, String userId) {
        return postRepository.findById(postId).map(post -> {
            List<String> likes = post.getLikes() != null ? post.getLikes() : new ArrayList<>();
            
            if (!likes.contains(userId)) {
                likes.add(userId);
                // Create notification for post owner
                notificationService.createNotification(
                    post.getUserId(),  // recipient (post owner)
                    userId,           // sender (user who liked)
                    postId,          // post ID
                    "LIKE"           // notification type
                );
            } else {
                likes.remove(userId);
            }
            
            post.setLikes(likes);
            return postRepository.save(post);
        });
    }
}
