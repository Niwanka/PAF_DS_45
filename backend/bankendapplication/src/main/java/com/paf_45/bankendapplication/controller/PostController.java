package com.paf_45.bankendapplication.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.paf_45.bankendapplication.model.Post;
import com.paf_45.bankendapplication.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Get all posts
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // Get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post savedPost = postService.createPost(post);
        return ResponseEntity.status(201).body(savedPost);
    }

    // Update an existing post
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post postDetails) {
        Optional<Post> existingPost = postService.getPostById(id);
        
        if (!existingPost.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        Post postToUpdate = existingPost.get();
        
        // Update the fields from postDetails
        postToUpdate.setTitle(postDetails.getTitle());
        postToUpdate.setContent(postDetails.getContent());
        postToUpdate.setTags(postDetails.getTags());
        postToUpdate.setMediaUrls(postDetails.getMediaUrls());
        
        Post updatedPost = postService.updatePost(id, postToUpdate);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        Optional<Post> existingPost = postService.getPostById(id);
        
        if (!existingPost.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Like a post
    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id, @RequestParam String userId) {
        Optional<Post> result = postService.toggleLike(id, userId);
        return result.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // Get likes of a post
    @GetMapping("/{id}/likes")
    public ResponseEntity<List<String>> getPostLikes(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(p -> ResponseEntity.ok(p.getLikes()))
                  .orElse(ResponseEntity.notFound().build());
    }
}