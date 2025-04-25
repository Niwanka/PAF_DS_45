package com.paf_45.bankendapplication.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.paf_45.bankendapplication.model.LearningProgressUpdate;
import java.util.List;

@Repository
public interface LearningProgressUpdateRepository extends MongoRepository<LearningProgressUpdate, String> {
    
    List<LearningProgressUpdate> findByUserId(String userId); //find updates by user ID

}
