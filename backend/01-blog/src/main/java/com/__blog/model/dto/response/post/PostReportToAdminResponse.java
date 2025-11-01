package com.__blog.model.dto.response.post;

import java.time.LocalDateTime;
import java.util.UUID;

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
    private LocalDateTime createdAt;
    private int likesCount;
    private int commentCount;
    private int reportCount;
}
