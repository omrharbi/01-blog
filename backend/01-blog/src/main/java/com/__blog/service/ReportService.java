package com.__blog.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.ReportMapper;
import com.__blog.model.dto.request.ReportRequest;
import com.__blog.model.dto.response.ReportResponse;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.Report;
import com.__blog.model.entity.User;
import com.__blog.repository.PostRepository;
import com.__blog.repository.ReportRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
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
    private ReportMapper reportMapper;
    // @Autowired
    // private CommentRespository commentRespository;
    @Autowired
    private ReportRepository reportRepository;

    public ResponseEntity<ApiResponse<ReportResponse>> createReport(UserPrincipal userPrincipal, ReportRequest reportRequest) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
        }
        UUID userId = userPrincipal.getId();
        Report report = new Report();
        var reporter = userRepository.findById(userId);
        report.setReasons(reportRequest.getReasons());
        report.setReporter(reporter.get());
        if (reportRequest.getPostReportId() != null) {
            var postOpt = postRepository.findById(reportRequest.getPostReportId());
            if (postOpt.isEmpty()) {
                return ApiResponseUtil.error("Post not found", HttpStatus.NOT_FOUND);
            }

            Post post = postOpt.get();
            if (userId.equals(post.getUser().getId())) {
                return ApiResponseUtil.error("You cannot report your own post", HttpStatus.BAD_REQUEST);
            }

            User reportedUser = post.getUser();
            report.setPost(post);
            report.setReportedUser(reportedUser);

            reportRepository.save(report);
            return ApiResponseUtil.success(null, null, "Report Posts Success");
        }
        return ApiResponseUtil.error("Post not found", HttpStatus.NOT_FOUND);

    }

    public ResponseEntity<ApiResponse<Page<ReportResponse>>> getAllReportPost(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Report> reports = reportRepository.findAllPostReports(pageable);

            if (reports == null) {
                return ApiResponseUtil.success(null, null, "No Post");
            }
            Page<ReportResponse> reportDTOs = reports.map(reportMapper::convReportToDTO);
            return ApiResponseUtil.success(reportDTOs, null, "Get All posts report");

        } catch (Exception e) {
            return ApiResponseUtil.error("Post not found", HttpStatus.NOT_FOUND);
        }

    }

    public ResponseEntity<ApiResponse<Page<ReportResponse>>> getAllReportUser(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            var report = reportRepository.findAllUserReports(pageable);
            if (report == null) {
                return ApiResponseUtil.success(null, null, "No User");
            }
            Page<ReportResponse> reportDTOs = report.map(reportMapper::convReportToDTO);

            return ApiResponseUtil.success(reportDTOs, null, "Get All posts report");

        } catch (Exception e) {
            return ApiResponseUtil.error("Post not found", HttpStatus.NOT_FOUND);
        }
    }
}
