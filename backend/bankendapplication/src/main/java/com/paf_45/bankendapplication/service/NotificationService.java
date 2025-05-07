package com.paf_45.bankendapplication.service;

import com.paf_45.bankendapplication.model.Notification;
import com.paf_45.bankendapplication.repository.NotificationRepository;
import com.paf_45.bankendapplication.model.UserProfile; // Add this
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserProfileService userProfileService; // Add this

    public Notification createNotification(String recipientId, String senderId, String postId, String type) {
        // Get sender's profile to use their name
        UserProfile senderProfile = userProfileService.getUserProfile(senderId)
                .orElse(null);
        
        String senderName = senderProfile != null ? 
            String.format("%s %s", senderProfile.getFirstName(), senderProfile.getLastName()) :
            "Someone";

        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setSenderId(senderId);
        notification.setSenderName(senderName); // Add this field to store sender's name
        notification.setPostId(postId);
        notification.setType(type);
        notification.setMessage(createNotificationMessage(senderName, type));
        return notificationRepository.save(notification);
    }

    private String createNotificationMessage(String senderName, String type) {
        return switch (type) {
            case "LIKE" -> String.format("%s liked your post", senderName);
            case "COMMENT" -> String.format("%s commented on your post", senderName);
            default -> "You have a new notification";
        };
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
}