package com.__blog.Component;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.NotificationResponse;
import com.__blog.model.entity.Notification;
import com.__blog.model.entity.User;
@Component
public class NotificationMapper {

    public NotificationResponse ConvertToDtoNotification(Notification notif) {
        return NotificationResponse.builder()
                .id(notif.getId())
                .type(notif.getType().name())
                .message(notif.getMessage())
                .read(notif.isStatus())
                .senderUsername(notif.getTriggerUser().getUsername())
                .senderAvatar(notif.getTriggerUser().getAvatarUrl())
                .createdAt(notif.getCreatedAt())
                .build();
    }

    public Notification ConvertToEntityNotification(NotificationRequest notif, User receiver, User triggerUser) {
        Notification notification = new Notification();
        notification.setReceiver(receiver);
        notification.setTriggerUser(triggerUser);
        notification.setType(notif.getType());
        notification.setMessage(notif.getMessage());
        notification.setStatus(false); // new notifications are unread by default
        return notification;
    }
}
