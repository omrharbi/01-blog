package com.__blog.Component;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.response.ReportResponse;
import com.__blog.model.entity.Report;
@Component
public class ReportMapper {

    public ReportResponse convReportToDTO(Report report) {
        String reportedContent = null;
        UUID postId = null;
        UUID commentId = null;

        if (report.getPost() != null) {
            reportedContent = report.getPost().getTitle(); 
            postId = report.getPost().getId();
        }
        //  else if (report.getComment() != null) {
        //     String content = report.getComment().getContent();
        //     reportedContent = content.length() > 50 ? content.substring(0, 50) + "..." : content;
        //     commentId = report.getComment().getId();
        // } 
        
        else if (report.getReportedUser() != null) {
            reportedContent = report.getReportedUser().getUsername();
        }

        return ReportResponse.builder()
                .reportId(report.getId()) // report ID
                .reportedContent(reportedContent) // post title /   username
                .reportedUser(report.getReportedUser() != null ? report.getReportedUser().getUsername() : null)
                .reportedUserId(report.getReportedUser() != null ? report.getReportedUser().getId() : null)
                .reporter(report.getReporter() != null ? report.getReporter().getUsername() : null)
                .reason(report.getReasons())
                .createdAt(report.getCreatedAt())
                // .status("pending") // you can adjust if you have a status field
                .postId(postId)
                .commentId(commentId)
                .build();
    }

}
