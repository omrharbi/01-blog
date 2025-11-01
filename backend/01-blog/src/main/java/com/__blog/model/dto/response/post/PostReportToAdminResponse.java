package com.__blog.model.dto.response.post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.__blog.model.dto.response.TagsResponse;

public class PostReportToAdminResponse {

    private UUID id;
    private String title;
    private String firstname;
    private String lastname;
    private LocalDateTime createdAt;
    private String firstImage;
    private List<TagsResponse> tags;
    private boolean isLiked;
}
