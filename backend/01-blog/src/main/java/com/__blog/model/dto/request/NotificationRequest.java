package com.__blog.model.dto.request;

import java.util.UUID;

import com.__blog.model.enums.Notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class NotificationRequest {

    // Type of notification (FOLLOW, NEW_POST, ADMIN_REPORT_POST, etc.)
    private Notifications type;

    // The user who triggers the notification
    private UUID triggerUserId;

    // The user who receives the notification
    private UUID receiverId;

    // Optional: if the notification is related to a specific post
    private UUID postId;

    // Optional: custom message override
    private String message;
}
