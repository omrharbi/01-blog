package com.__blog.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.__blog.Component.NotificationMapper;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.entity.Notification;
import com.__blog.model.entity.User;
import com.__blog.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    // Service logic goes here
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    public void sendNotification(UUID username, NotificationRequest notification) {
        try {
              String destination = "/topic/user." + username + ".notification";

            log.info("🔔 SENDING NOTIFICATION:");
            log.info("🔔 To user ID: {}", username);
            log.info("🔔 Destination: {}", destination);
            log.info("🔔 Payload: {}", notification);

            // Try both methods for testing
            messagingTemplate.convertAndSend(destination, notification);

            log.info("✅ Notification sent via convertAndSendToUser");

        } catch (Exception e) {
            log.error("❌ Error sending notification: {}", e.getMessage(), e);
        }
    }

    public void saveNotification(NotificationRequest notification, User receiver, User triggerUser) {
        Notification notif = notificationMapper.ConvertToEntityNotification(notification, receiver, triggerUser);
        notificationRepository.save(notif);
    }
}
