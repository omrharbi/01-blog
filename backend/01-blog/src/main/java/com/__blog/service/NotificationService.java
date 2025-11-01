package com.__blog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.__blog.Component.NotificationMapper;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.NotificationResponse;
import com.__blog.model.entity.Notification;
import com.__blog.model.entity.User;
import com.__blog.repository.NotificationRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

import jakarta.transaction.Transactional;
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

    private ResponseEntity<ApiResponse<String>> sendNotification(User users, NotificationRequest notification) {
        try {
            if (users == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = users.getId();
            String destination = "/topic/user." + userId + ".notification";
            messagingTemplate.convertAndSend(destination, notification);

            return ApiResponseUtil.success(null, null, "end Notifcation");
        } catch (MessagingException e) {
            log.error("❌ Error sending notification: {}", e.getMessage(), e);
            return ApiResponseUtil.error("❌ Error sending notification: {}" + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    private void saveNotification(NotificationRequest notification, User receiver, User triggerUser) {
        Notification notif = notificationMapper.ConvertToEntityNotification(notification, receiver, triggerUser);
        notificationRepository.save(notif);
    }

    @Transactional
    public ResponseEntity<ApiResponse<String>> saveAndSendNotification(NotificationRequest notification, User receiver, User triggerUser) {
        ResponseEntity<ApiResponse<String>> response = sendNotification(receiver, notification);
        if (response == null) {
            return ApiResponseUtil.error(
                    "❌ Failed to send notification to user: " + receiver.getId(),
                    HttpStatus.BAD_REQUEST
            );

        }
        var sendResponse = response.getBody();
        if (sendResponse != null && sendResponse.isStatus()) {
            // Only save if sending succeeded
            saveNotification(notification, receiver, triggerUser);
            return ApiResponseUtil.success(null, null, "✅ Notification sent and saved successfully");
        } else {
            return ApiResponseUtil.error("❌ Error sending notification", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getAllNotificationByUser(UserPrincipal userPrincipal) {
        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            User user = userPrincipal.getUser();

            // Fetch notifications for the user, ordered by creation date descending
            List<Notification> notificationsList = notificationRepository
                    .findByReceiverIdOrderByCreatedAtDesc(user.getId());
            if (notificationsList == null || notificationsList.isEmpty()) {
                // No notifications found
                return ApiResponseUtil.success(new ArrayList<>(), null, "No notifications found");
            }
            // Convert each Notification entity to NotificationResponse DTO
            List<NotificationResponse> notificationResponses = new ArrayList<>();
            for (Notification notification : notificationsList) {
                notificationResponses.add(notificationMapper.ConvertToDtoNotification(notification));
            }

            // Return success with notifications
            return ApiResponseUtil.success(notificationResponses, null, "Notifications retrieved successfully");

        } catch (Exception e) {
            // Handle unexpected exceptions
            return ApiResponseUtil.error("Failed to fetch notifications: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<Boolean>> readNotification(UUID notifid) {
        Optional<Notification> getNotification = notificationRepository.findById(notifid);
        if (getNotification.isPresent()) {
            getNotification.get().setStatus(true);
            notificationRepository.save(getNotification.get());
            return ApiResponseUtil.success(true, null, "Notifications read successfully");
        }
        return ApiResponseUtil.error("Failed to fetch notifications: ",
                HttpStatus.NOT_FOUND);
    }

}
