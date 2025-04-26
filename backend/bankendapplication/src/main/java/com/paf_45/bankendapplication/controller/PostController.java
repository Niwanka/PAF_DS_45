package com.paf_45.bankendapplication.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paf_45.bankendapplication.model.Post;
import com.paf_45.bankendapplication.model.PostResponse;
import com.paf_45.bankendapplication.service.PostService;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // Get all posts with HATEOAS links
    @GetMapping
    public ResponseEntity<CollectionModel<PostResponse>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        
        List<PostResponse> postResponses = posts.stream()
            .map(post -> {
                PostResponse response = new PostResponse(post);
                
                // Add self link
                Link selfLink = linkTo(methodOn(PostController.class)
                        .getPostById(post.getId())).withSelfRel();
                response.add(selfLink);
                
                // Add link to all posts
                Link postsLink = linkTo(methodOn(PostController.class)
                        .getAllPosts()).withRel("posts");
                response.add(postsLink);
                
                // Add link to comments for this post
                Link commentsLink = linkTo(methodOn(CommentController.class)
                        .getCommentsByPostId(post.getId())).withRel("comments");
                response.add(commentsLink);
                
                return response;
            })
            .collect(Collectors.toList());
        
        // Create collection model with links
        CollectionModel<PostResponse> collectionModel = CollectionModel.of(postResponses);
        
        // Add link to self (collection)
        collectionModel.add(linkTo(methodOn(PostController.class)
                .getAllPosts()).withSelfRel());
        
        return ResponseEntity.ok(collectionModel);
    }

    // Get a post by ID with HATEOAS links
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        
        if (!post.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        PostResponse response = new PostResponse(post.get());
        
        // Add self link
        Link selfLink = linkTo(methodOn(PostController.class)
                .getPostById(id)).withSelfRel();
        response.add(selfLink);
        
        // Add link to all posts
        Link postsLink = linkTo(methodOn(PostController.class)
                .getAllPosts()).withRel("posts");
        response.add(postsLink);
        
        // Add link to comments for this post
        Link commentsLink = linkTo(methodOn(CommentController.class)
                .getCommentsByPostId(id)).withRel("comments");
        response.add(commentsLink);
        
        return ResponseEntity.ok(response);
    }

    // Create a new post with HATEOAS links
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody Post post) {
        Post savedPost = postService.createPost(post);
        PostResponse response = new PostResponse(savedPost);
        
        // Add self link
        Link selfLink = linkTo(methodOn(PostController.class)
                .getPostById(savedPost.getId())).withSelfRel();
        response.add(selfLink);
        
        // Add link to all posts
        Link postsLink = linkTo(methodOn(PostController.class)
                .getAllPosts()).withRel("posts");
        response.add(postsLink);
        
        return ResponseEntity.status(201).body(response);
    }

    // Update an existing post with HATEOAS links
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable String id, @RequestBody Post postDetails) {
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
        PostResponse response = new PostResponse(updatedPost);
        
        // Add self link
        Link selfLink = linkTo(methodOn(PostController.class)
                .getPostById(updatedPost.getId())).withSelfRel();
        response.add(selfLink);
        
        // Add link to all posts
        Link postsLink = linkTo(methodOn(PostController.class)
                .getAllPosts()).withRel("posts");
        response.add(postsLink);
        
        return ResponseEntity.ok(response);
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
}