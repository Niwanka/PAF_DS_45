package com.paf_45.bankendapplication.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.paf_45.bankendapplication.model.Post;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // ...existing code...
    List<Post> findByUserId(String userId, Sort sort);
}

