package com.paf_45.bankendapplication.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    public String getCurrentUserId() {
        OAuth2User principal = (OAuth2User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return principal.getAttribute("sub");
    }
    
    public boolean isUserAuthorized(String resourceUserId) {
        String currentUserId = getCurrentUserId();
        return currentUserId != null && currentUserId.equals(resourceUserId);
    }
}