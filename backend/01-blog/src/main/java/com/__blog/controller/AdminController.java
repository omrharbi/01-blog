package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all-users")
    public ResponseEntity<?> allUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return adminService.getAllUsers(page, size);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/count-users")
    public ResponseEntity<?> countUsers() {
        return adminService.countAllUser();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/hidan-post/{postId}")
    public String hidanPost(@PathVariable("postId") UUID postId) {
        // return adminService.loginUser(user);
        return "";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/ban-user/{userId}")
    public ResponseEntity<?> banUser(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("userId") UUID userId, @RequestParam("days") int days) {
        return adminService.banUser(userPrincipal, userId, days);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable("userId") UUID userId) {
        return adminService.deleteUser(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/unban-user")
    public String UnbanUser() {
        // return userService.loginUser(user);
        return "";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all-posts")
    public ResponseEntity<?> allPosts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return adminService.getAllPosts(page, size);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/deletePost")
    public String deletePost() {
        // return userService.loginUser(user);
        return "";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/change-role/{userId}")
    public ResponseEntity<?> changeRole(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("userId") UUID userId) {
        return adminService.changeRole(userPrincipal, userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/hiddeng-post/{postId}")
    public ResponseEntity<?> HiddengPost(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("postId") UUID postId) {
        return adminService.HiddengPost(userPrincipal, postId);
    }

}
