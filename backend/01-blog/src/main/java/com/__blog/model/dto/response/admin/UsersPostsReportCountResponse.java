package com.__blog.model.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UsersPostsReportCountResponse {
    private long countPosts;
    private long countUser;
    private long countReport;
}
