package com.__blog.model.entity;

import java.util.Date;
import java.util.UUID;

import com.__blog.model.enums.Notifications;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "notification")
@Entity
@Getter
@Setter
public class Notification {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
// Type of notification (e.g., SUBSCRIPTION, MESSAGE)
    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private Notifications type;

    @Column(name = "status")
    private boolean status; // false = unread, true = read

    @Column(name = "created_at", nullable = false)
    private Date createdAt = new Date();
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "receiver", nullable = false)
    private User receiver;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "trigger_user_id", nullable = false)
    private User triggerUser;
    @Column(name = "message", length = 255)
    private String message;
}
