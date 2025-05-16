package com.paf_45.bankendapplication.service;

import com.paf_45.bankendapplication.model.Comment;
import com.paf_45.bankendapplication.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostService postService; // Add this to get post information

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // Get post author ID and create notification
        postService.getPostById(comment.getPostId()).ifPresent(post -> {
            // Only create notification if commenter is not the post author
            if (!post.getUserId().equals(comment.getUserId())) {
                notificationService.createNotification(
                    post.getUserId(),    // recipient (post owner)
                    comment.getUserId(), // sender (commenter)
                    comment.getPostId(), // post ID
                    "COMMENT"           // notification type
                );
            }
        });

        return savedComment;
    }

    public Optional<Comment> getCommentById(String id) {
        return commentRepository.findById(id);
    }

    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }

    public Comment updateComment(String id, Comment updatedComment) {
        return commentRepository.findById(id).map(comment -> {
            comment.setContent(updatedComment.getContent());
            comment.setUpdatedAt(LocalDateTime.now());  // Always set current time when updating
            return commentRepository.save(comment);
        }).orElse(null);
    }

    public long getCommentCountByPostId(String postId) {
        return commentRepository.countByPostId(postId);
    }
}