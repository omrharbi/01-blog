package com.__blog.model.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.__blog.model.enums.ReportReason;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Table(name = "report")
@Entity
@Data
public class Report {

   @Id
    @GeneratedValue
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    

     @Column(name = "reason", nullable = false)
    private ReportReason reasons;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = true)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = true)
    private Comment comment;
    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = true)
    private User reporter;
    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser;
//GET /api/report-reasons
}
