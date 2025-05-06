package com.paf_45.bankendapplication.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.paf_45.bankendapplication.model.Post;
import com.paf_45.bankendapplication.repository.PostRepository;

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

    // Toggle like on a post
    public Optional<Post> toggleLike(String postId, String userId) {
        return postRepository.findById(postId).map(post -> {
            List<String> likes = post.getLikes() != null ? post.getLikes() : new ArrayList<>();
            
            if (likes.contains(userId)) {
                // Unlike
                likes.remove(userId);
            } else {
                // Like
                likes.add(userId);
            }
            
            post.setLikes(likes);
            return postRepository.save(post);
        });
    }
}
