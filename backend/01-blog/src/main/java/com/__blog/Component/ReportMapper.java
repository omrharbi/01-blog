package com.__blog.Component;

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
                .postId(report.getPost() != null ? report.getPost().getId() : null)
                .reportId(report.getReporter().getId())
                .reportedContent(reportedContent)
                .reportedUser(report.getReportedUser() != null ? report.getReportedUser().getUsername() : null)
                .reportedUserId(report.getReportedUser() != null ? report.getReportedUser().getId() : null)
                .reporter(report.getReporter() != null ? report.getReporter().getUsername() : null)
                .reason(report.getReasons())
                .createdAt(report.getCreatedAt())
                // .status(report.getReportedUser() != null ? report.getReportedUser().isHidden() : null)
                .hidden(report.getPost() != null ? report.getPost().isHidden() : null)
                .build();
    }

}
