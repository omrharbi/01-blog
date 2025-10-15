package com.__blog.model.entity;

import java.util.Date;
import java.util.UUID;

import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "notification")
@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
// Type of notification (e.g., SUBSCRIPTION, MESSAGE)
    @Column(name = "type")
    private String type;

    @Column(name = "status")
    private boolean status;

    @Column(name = "created_at", nullable = false)
    private Date create_at = new Date();

 
    @ManyToOne
    @JoinColumn(name = "receiver", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "trigger_user_id", nullable = false)
    private User triggerUser;

}
