package com.__blog.service;

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

    public void sendNotification(User user, NotificationRequest notification) {
        log.info("Sending Ws notification to {} with payload {}", user.getUsername(), notification);
        messagingTemplate.convertAndSendToUser(
                user.getUsername(),
                "/notification",
                notification
        );
    }

    public void saveNotification(NotificationRequest notification, User receiver, User triggerUser) {
        Notification notif = notificationMapper.ConvertToEntityNotification(notification, receiver, triggerUser);
        notificationRepository.save(notif);
    }
}
