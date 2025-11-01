package com.__blog.model.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.__blog.model.enums.ReportReason;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse {

    private UUID reportId;          // the report ID
    private String reportedContent; // post title / comment snippet / username
    private String reportedUser;    // username of the reported user
    private String reporter;        // username of the reporter
    private ReportReason reason;    // report reason
    private LocalDateTime createdAt; // timestamp
    private String status;          // e.g., "pending", "resolved"
    private UUID postId;            // optional, if content is post
    private UUID commentId;         // optional, if content is comment
    private UUID reportedUserId;    // optional, if just user reported
}
