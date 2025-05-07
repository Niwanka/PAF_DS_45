package com.paf_45.bankendapplication.service;

import com.paf_45.bankendapplication.model.Comment;
import com.paf_45.bankendapplication.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
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
            comment.setUpdatedAt(updatedComment.getUpdatedAt());
            return commentRepository.save(comment);
        }).orElse(null);
    }

    public long getCommentCountByPostId(String postId) {
        return commentRepository.countByPostId(postId);
    }
}