package com.__blog.model.dto.response.post;

import java.time.LocalDateTime;
import java.util.UUID;

import com.__blog.model.enums.Roles;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class PostReportToAdminResponse {

    private UUID id;
    private String title;
    private String firstname;
    private String lastname;
    private Roles role;
    private boolean hidden;
    private LocalDateTime createdAt;
    private long likesCount;
    private long commentCount;
    private long reportCount;

    public PostReportToAdminResponse(UUID id, String title, String firstname, String lastname,
            Roles role,
            boolean hidden, LocalDateTime createdAt,
            long likesCount, long commentCount, long reportCount) {
        this.id = id;
        this.title = title;
        this.firstname = firstname;
        this.lastname = lastname;
        this.role = role;
        this.hidden = hidden;
        this.createdAt = createdAt;
        this.likesCount = likesCount;
        this.commentCount = commentCount;
        this.reportCount = reportCount;
    }
}
