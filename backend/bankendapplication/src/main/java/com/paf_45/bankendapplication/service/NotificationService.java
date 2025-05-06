package com.paf_45.bankendapplication.service;

import com.paf_45.bankendapplication.model.Notification;
import com.paf_45.bankendapplication.repository.NotificationRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String recipientId, String senderId, String postId, String type) {
        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setSenderId(senderId);
        notification.setPostId(postId);
        notification.setType(type);
        notification.setMessage(createNotificationMessage(senderId, type));
        return notificationRepository.save(notification);
    }

    private String createNotificationMessage(String senderId, String type) {
        return switch (type) {
            case "LIKE" -> String.format("User %s liked your post", senderId);
            case "COMMENT" -> String.format("User %s commented on your post", senderId);
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