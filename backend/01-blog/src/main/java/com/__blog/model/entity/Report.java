package com.__blog.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.__blog.model.enums.ReportReason;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = true)
    private User user;

    // ✅ Multiple reasons
    @ElementCollection(targetClass = ReportReason.class)
    @CollectionTable(
            name = "report_reasons",
            joinColumns = @JoinColumn(name = "report_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "reason", nullable = false)
    private List<ReportReason> reasons = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = true)
    private Post post;

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = true)
    private Comment comment;
    @ManyToOne
    @JoinColumn(name = "reported_user_id")

    private User reportedUser;

}
