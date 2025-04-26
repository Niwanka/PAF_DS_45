package com.paf_45.bankendapplication.controller;

import com.paf_45.bankendapplication.model.Comment;
import com.paf_45.bankendapplication.model.CommentResponse;
import com.paf_45.bankendapplication.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get comments by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<CollectionModel<CommentResponse>> getCommentsByPostId(@PathVariable String postId) {
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        
        List<CommentResponse> commentResponses = comments.stream()
            .map(comment -> {
                CommentResponse response = new CommentResponse(comment);
                
                // Add self link
                Link selfLink = linkTo(methodOn(CommentController.class)
                        .getCommentById(comment.getId())).withSelfRel();
                response.add(selfLink);
                
                // Add link to parent post
                Link postLink = linkTo(methodOn(PostController.class)
                        .getPostById(comment.getPostId())).withRel("post");
                response.add(postLink);
                
                return response;
            })
            .collect(Collectors.toList());
        
        // Create collection model with links
        CollectionModel<CommentResponse> collectionModel = CollectionModel.of(commentResponses);
        
        // Add link to self (collection)
        collectionModel.add(linkTo(methodOn(CommentController.class)
                .getCommentsByPostId(postId)).withSelfRel());
        
        // Add link to the post
        collectionModel.add(linkTo(methodOn(PostController.class)
                .getPostById(postId)).withRel("post"));
        
        return ResponseEntity.ok(collectionModel);
    }
    
    // Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<CommentResponse> getCommentById(@PathVariable String id) {
        Optional<Comment> comment = commentService.getCommentById(id);
        
        if (!comment.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        CommentResponse response = new CommentResponse(comment.get());
        
        // Add self link
        Link selfLink = linkTo(methodOn(CommentController.class)
                .getCommentById(id)).withSelfRel();
        response.add(selfLink);
        
        // Add link to parent post
        Link postLink = linkTo(methodOn(PostController.class)
                .getPostById(comment.get().getPostId())).withRel("post");
        response.add(postLink);
        
        return ResponseEntity.ok(response);
    }

    // Add a new comment
    @PostMapping
    public ResponseEntity<CommentResponse> addComment(@RequestBody Comment comment) {
        Comment addedComment = commentService.addComment(comment);
        CommentResponse response = new CommentResponse(addedComment);
        
        // Add self link
        Link selfLink = linkTo(methodOn(CommentController.class)
                .getCommentById(addedComment.getId())).withSelfRel();
        response.add(selfLink);
        
        // Add link to parent post
        Link postLink = linkTo(methodOn(PostController.class)
                .getPostById(addedComment.getPostId())).withRel("post");
        response.add(postLink);
        
        return ResponseEntity.status(201).body(response);
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable String id, @RequestBody Comment updatedComment) {
        Comment comment = commentService.updateComment(id, updatedComment);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }
        
        CommentResponse response = new CommentResponse(comment);
        
        // Add self link
        Link selfLink = linkTo(methodOn(CommentController.class)
                .getCommentById(id)).withSelfRel();
        response.add(selfLink);
        
        // Add link to parent post
        Link postLink = linkTo(methodOn(PostController.class)
                .getPostById(comment.getPostId())).withRel("post");
        response.add(postLink);
        
        return ResponseEntity.ok(response);
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}