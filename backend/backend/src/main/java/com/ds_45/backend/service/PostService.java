package com.ds_45.backend.service;

import com.ds_45.backend.model.Post;
import com.ds_45.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

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
        return postRepository.findByUserId(userId);
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
            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }).orElse(null);
    }

    // Delete a post
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
