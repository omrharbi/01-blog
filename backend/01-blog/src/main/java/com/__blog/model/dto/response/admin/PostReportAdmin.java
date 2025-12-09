package com.__blog.model.dto.response.admin;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class PostReportAdmin {
    private Boolean hidden;
    private UUID postId; 
}
