package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/all-users")
    public ResponseEntity<?> allUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/count-users")
    public ResponseEntity<?> countUsers() {
        return adminService.countAllUser();
    }

    @PostMapping("/hidan-post/{postId}")
    public String hidanPost(@PathVariable("postId") UUID postId) {
        // return adminService.loginUser(user);
        return "";
    }

    @PostMapping("/ban-user/{userId}")
    public ResponseEntity<?> banUser(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("userId") UUID userId, @RequestParam("days") int days) {
        return adminService.banUser(userPrincipal, userId, days);
    }

    @PostMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable("userId") UUID userId) {
        return adminService.deleteUser(userId);
    }

    @PostMapping("/unban-user")
    public String UnbanUser() {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/all-posts")
    public ResponseEntity<?> allPosts() {
        return adminService.getAllPosts();
        // return "";
    }

    @PostMapping("/deletePost")
    public String deletePost() {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/change-role/{userId}")
    public ResponseEntity<?> changeRole(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("userId") UUID userId) {
        return adminService.changeRole(userPrincipal, userId);
    }

    @PostMapping("/hiddeng-post/{postId}")
    public ResponseEntity<?> HiddengPost(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("postId") UUID postId) {
        return adminService.HiddengPost(userPrincipal, postId);
    }

}
