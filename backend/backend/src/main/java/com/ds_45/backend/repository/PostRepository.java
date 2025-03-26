package com.ds_45.backend.repository;

import com.ds_45.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String>{
    List<Post> findByUserId(String userId);  // Fetch all posts by a specific user
}

