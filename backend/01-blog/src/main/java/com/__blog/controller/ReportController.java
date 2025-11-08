package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.ReportRequest;
import com.__blog.security.UserPrincipal;
import com.__blog.service.ReportService;

@RestController
@RequestMapping("/api/report")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping("/create-report")
    public ResponseEntity<?> createReport(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ReportRequest reportRequest) {
        return reportService.createReport(userPrincipal, reportRequest);
    }

    @PostMapping("/create-report-user")
    public ResponseEntity<?> createReportUser(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ReportRequest reportRequest) {
        System.err.println("****************" + reportRequest);
        return reportService.createReportUser(userPrincipal, reportRequest);
        // return  ResponseEntity.ok(null);
    }

    @GetMapping("/admin/get-posts-all-report")
    public ResponseEntity<?> getAllRepostPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reportService.getAllReportPost(page, size);
    }

    @GetMapping("/admin/get-user-all-report")
    public ResponseEntity<?> getAllRepostUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reportService.getAllReportUser(page, size);
    }
}
