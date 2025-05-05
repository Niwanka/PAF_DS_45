package com.paf_45.bankendapplication.repository;

import com.paf_45.bankendapplication.model.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    Optional<UserProfile> findBySub(String sub);
    void deleteBySub(String sub);
}