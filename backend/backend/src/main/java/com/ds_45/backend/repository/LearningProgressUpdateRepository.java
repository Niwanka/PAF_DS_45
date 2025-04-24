package com.ds_45.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.ds_45.backend.model.LearningProgressUpdate;
import java.util.List;

@Repository
public interface LearningProgressUpdateRepository extends MongoRepository<LearningProgressUpdate, String> {
    
    List<LearningProgressUpdate> findByUserID(String userId); //find updates by user ID

}
