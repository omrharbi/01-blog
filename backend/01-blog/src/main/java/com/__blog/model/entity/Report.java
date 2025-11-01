package com.__blog.model.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.__blog.model.enums.ReportReason;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "report")
@Entity
@Getter
@Setter
public class Report {

    @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    // @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false)
    private ReportReason reasons;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = true)
    private Post post;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = true)
    private Comment comment;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = true)
    private User reporter;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;
}
