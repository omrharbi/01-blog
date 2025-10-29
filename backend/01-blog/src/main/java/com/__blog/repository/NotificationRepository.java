package com.__blog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Notification;
import com.__blog.model.enums.Notifications;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByReceiverIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByTypeAndReceiverIdAndTriggerUserId(Notifications type, UUID receiverId, UUID triggerUserId);
}
