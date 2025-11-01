package com.__blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.ReportRequest;
import com.__blog.model.dto.response.ReportResponse;
 import com.__blog.model.entity.Report;
import com.__blog.repository.CommentRespository;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class ReportService {
    // Service methods will go here
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRespository commentRespository;

    public ResponseEntity<ApiResponse<ReportResponse>> createReport(ReportRequest reportRequest) {
        Report report = new Report();
        var reporter = userRepository.findById(reportRequest.getReporterId());// this is me i report post
        if (reportRequest.getPostReportId() != null) {
            var post = postRepository.findById(reportRequest.getPostReportId());
            if (post.isPresent()) {
                report.setPost(post.get());
                report.setReportedUser(post.get().getUser());
                report.setReporter(reporter.get());
            }
        }
        if (reportRequest.getCommentReportId() != null) {
            var comment = commentRespository.findById(reportRequest.getCommentReportId());
            if (comment.isPresent()) {
                report.setComment(comment.get());
                report.setReportedUser(comment.get().getUser());
                report.setReporter(reporter.get());
            }
        }
        if (reportRequest.getReportedUserId() != null) {
            var user = userRepository.findById(reportRequest.getReportedUserId());
            if (user.isPresent()) {
                report.setReportedUser(user.get());
                report.setReporter(reporter.get());
            }
        }

        return ApiResponseUtil.error("Post or User not found", HttpStatus.NOT_FOUND);
    }
}