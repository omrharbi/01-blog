package com.__blog.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.__blog.Component.NotificationMapper;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.NotificationResponse;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.Notification;
import com.__blog.model.entity.User;
import com.__blog.repository.NotificationRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

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
            messagingTemplate.convertAndSend(destination, notification);
        } catch (Exception e) {
            log.error("❌ Error sending notification: {}", e.getMessage(), e);
        }
    }

    public void saveNotification(NotificationRequest notification, User receiver, User triggerUser) {
        Notification notif = notificationMapper.ConvertToEntityNotification(notification, receiver, triggerUser);
        notificationRepository.save(notif);
    }

    public ApiResponse<List<NotificationResponse>> getAllNotificationByUser(UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        // var notification = notificationRepository.findById(user.getId());
        // log.info("user {}", notification.get().getId());
        // if (notification.isPresent()) {
        List<Notification> notificationRequest = notificationRepository
                .findByReceiverIdOrderByCreatedAtDesc(user.getId());
        if (notificationRequest != null) {
            for (Notification elem : notificationRequest) {
                var  notificationResponse= convertToResponse(elem);
            }
            // var convert=convertToResponse()
            return ApiResponse.<List<NotificationResponse>>builder()
                    .status(true)
                    .message("notifications")
                    // .data(notificationRequest)
                    .build();
        } else {
            return ApiResponse.<List<NotificationResponse>>builder()
                    .status(false)
                    .message("notifications")
                    // .data(notificationRequest)
                    .build();
        }
    }

    private NotificationResponse convertToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                // .read(notification.getr)
                .createdAt(notification.getCreatedAt())
                // .triggerUserId(convertToUserResponse(notification.getTriggerUser()))
                .build();
    }

    private UserResponse convertToUserResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .avatar(user.getAvatarUrl())
                .build();
    }
}
