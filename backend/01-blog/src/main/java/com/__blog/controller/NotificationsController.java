package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.NotificationService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/notifications")
public class NotificationsController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/getAllNotifications")

    public ResponseEntity<?> getAllNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        var getNotifications = notificationService.getAllNotificationByUser(userPrincipal);

        return ResponseEntity.ok(getNotifications);
    }
}
