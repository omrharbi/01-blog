package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/getAllNotifications")

    public ResponseEntity<?> getAllNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return notificationService.getAllNotificationByUser(userPrincipal);
    }

    @PostMapping("/read/{notificationId}")

    public ResponseEntity<?> readNotification(@PathVariable("notificationId") UUID notificationId) {

        return notificationService.readNotification(notificationId);
    }
}
