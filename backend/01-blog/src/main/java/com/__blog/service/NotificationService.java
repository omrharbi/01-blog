package com.__blog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.__blog.Component.NotificationMapper;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.NotificationResponse;
import com.__blog.model.entity.Notification;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Notifications;
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

    private ApiResponse<String> sendNotification(UUID userid, NotificationRequest notification) {
        try {

            String destination = "/topic/user." + userid + ".notification";
            messagingTemplate.convertAndSend(destination, notification);
            return ApiResponse.<String>builder()
                    .status(true)
                    .message("send Notifcation")
                    .build();
        } catch (MessagingException e) {
            log.error("❌ Error sending notification: {}", e.getMessage(), e);
            return ApiResponse.<String>builder()
                    .status(false)
                    .error("❌ Error sending notification: {}" + e.getMessage())
                    .build();
        }
    }

    private void saveNotification(NotificationRequest notification, User receiver, User triggerUser) {
        Notification notif = notificationMapper.ConvertToEntityNotification(notification, receiver, triggerUser);
        notificationRepository.save(notif);
    }

    private boolean CheckAllReadySendNotifications(Notifications notif, UUID receiver, UUID triggerUser) {
        var checkUser = notificationRepository.existsByTypeAndReceiverIdAndTriggerUserId(notif, receiver, triggerUser);
        return checkUser;
    }

    public void broadcasts() {
        // List<Subscription> followers 
    }

    public ApiResponse<String> saveAndSendNotification(NotificationRequest notification, User receiver, User triggerUser) {
        ApiResponse<String> sendResponse = sendNotification(receiver.getId(), notification);

        if (sendResponse.isStatus()) {
            // Only save if sending succeeded
            saveNotification(notification, receiver, triggerUser);
            return ApiResponse.<String>builder()
                    .status(true)
                    .message("✅ Notification sent and saved successfully")
                    .build();
        } else {
            return ApiResponse.<String>builder()
                    .status(false)
                    .error(sendResponse.getError() != null ? sendResponse.getError() : "❌ Error sending notification")
                    .build();
        }
    }

    public ApiResponse<List<NotificationResponse>> getAllNotificationByUser(UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        List<Notification> notificationRequest = notificationRepository
                .findByReceiverIdOrderByCreatedAtDesc(user.getId());
        if (notificationRequest != null) {
            List<NotificationResponse> notification = new ArrayList<>();
            for (Notification elem : notificationRequest) {
                var notificationResponse = notificationMapper.ConvertToDtoNotification(elem);
                notification.add(notificationResponse);
            }
            return ApiResponse.<List<NotificationResponse>>builder()
                    .status(true)
                    .message("notifications")
                    .data(notification)
                    .build();
        } else {
            return ApiResponse.<List<NotificationResponse>>builder()
                    .status(false)
                    .message("notifications")
                    // .data(notificationRequest)
                    .build();
        }
    }
}
