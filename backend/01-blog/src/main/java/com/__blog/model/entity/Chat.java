package com.__blog.model.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "chat")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String message;  // text message

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender_id; // who sent the message

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver_id; // who receives the message

    @Column(nullable = false)
    private Date createdAt = new Date();

}
