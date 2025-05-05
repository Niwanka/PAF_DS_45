package com.paf_45.bankendapplication.controller;

import com.paf_45.bankendapplication.model.Comment;
import com.paf_45.bankendapplication.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Get comments by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    // Add a new comment
    @PostMapping
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        return ResponseEntity.status(201).body(commentService.addComment(comment));
    }

    // Update a comment
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@PathVariable String id, @RequestBody Comment updatedComment) {
        Comment comment = commentService.updateComment(id, updatedComment);
        if (comment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(comment);
    }

    // Delete a comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}