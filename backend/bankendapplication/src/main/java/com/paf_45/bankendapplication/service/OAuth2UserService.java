package com.paf_45.bankendapplication.service;

import com.paf_45.bankendapplication.model.UserProfile;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import java.time.LocalDateTime;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Map;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        // Extract user details from Google's response
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        
        // Check if user exists
        Query query = new Query(Criteria.where("email").is(email));
        UserProfile userProfile = mongoTemplate.findOne(query, UserProfile.class);
        
        if (userProfile == null) {
            // Create new user
            userProfile = new UserProfile();
            userProfile.setEmail(email);
            userProfile.setEmailVerified((Boolean) attributes.get("email_verified"));
            userProfile.setFirstName((String) attributes.get("given_name"));
            userProfile.setLastName((String) attributes.get("family_name"));
            userProfile.setPicture((String) attributes.get("picture"));
            userProfile.setLocale((String) attributes.get("locale"));
            userProfile.setSub((String) attributes.get("sub"));
            userProfile.setAccessToken(userRequest.getAccessToken().getTokenValue());
            
            // Set token expiry using the token's expiration instant
            Instant expiresAt = userRequest.getAccessToken().getExpiresAt();
            if (expiresAt != null) {
                userProfile.setTokenExpiryDate(LocalDateTime.ofInstant(expiresAt, ZoneId.systemDefault()));
            }
            
            // Save new user
            mongoTemplate.save(userProfile);
        } else {
            // Update existing user
            userProfile.setLastLogin(LocalDateTime.now());
            userProfile.setAccessToken(userRequest.getAccessToken().getTokenValue());
            
            // Update token expiry
            Instant expiresAt = userRequest.getAccessToken().getExpiresAt();
            if (expiresAt != null) {
                userProfile.setTokenExpiryDate(LocalDateTime.ofInstant(expiresAt, ZoneId.systemDefault()));
            }
            
            mongoTemplate.save(userProfile);
        }
        
        return oauth2User;
    }
} 