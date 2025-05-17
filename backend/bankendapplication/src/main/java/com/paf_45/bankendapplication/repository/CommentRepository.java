package com.paf_45.bankendapplication.repository;

import com.paf_45.bankendapplication.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    long countByPostId(String postId);
}