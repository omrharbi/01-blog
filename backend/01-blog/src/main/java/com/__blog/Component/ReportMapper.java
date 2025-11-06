package com.__blog.Component;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.response.ReportResponse;
import com.__blog.model.entity.Report;

@Component
public class ReportMapper {

    public ReportResponse convReportToDTO(Report report) {
        String reportedContent = null;
        // UUID commentId = null;

        if (report.getPost() != null) {
            reportedContent = report.getPost().getTitle();
        }

        else if (report.getReportedUser() != null) {
            reportedContent = report.getReportedUser().getUsername();
        }

        return ReportResponse.builder()
                .postId(report.getId()) // report ID
                .reportId(report.getReporter().getId()) // report ID
                .reportedContent(reportedContent) // post title / username
                .reportedUser(report.getReportedUser() != null ? report.getReportedUser().getUsername() : null)
                .reportedUserId(report.getReportedUser() != null ? report.getReportedUser().getId() : null)
                .reporter(report.getReporter() != null ? report.getReporter().getUsername() : null)
                .reason(report.getReasons())
                .createdAt(report.getCreatedAt())
                .status(report.isStatus()) // you can adjust if you have a status field
                // .commentId(report.getComment().getId())
                .build();
    }

}
