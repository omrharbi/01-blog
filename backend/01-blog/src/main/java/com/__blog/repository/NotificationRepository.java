package com.__blog.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Notification;

@Repository
public interface  NotificationRepository extends JpaRepository<Notification, UUID> {

    // List<NotificationResponse>
}