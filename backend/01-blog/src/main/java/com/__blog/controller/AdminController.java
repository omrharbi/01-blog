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
    private AdminService userService;

    @GetMapping("/all-users")
    public ResponseEntity<?> allUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/count-users")
    public ResponseEntity<?> countUsers() {
        return userService.countAllUser();
    }

    @PostMapping("/hidan-post/{postId}")
    public String hidanPost(@PathVariable("postId") UUID postId) {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/ban-user/{userId}")
    public ResponseEntity<?> banUser(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("userId") UUID userId, @RequestParam("days") int days) {
        return userService.banUser(userPrincipal, userId, days);
    }

    @PostMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable("userId") UUID userId) {
        return userService.deleteUser(userId);
    }

    @PostMapping("/UnbanUser")
    public String UnbanUser() {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/deleteUser")
    public String deleteUser() {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/deletePost")
    public String deletePost() {
        // return userService.loginUser(user);
        return "";
    }
    // @PostMapping("/allUsers")
    // public String AllPostsReport() {
    // // return userService.loginUser(user);
    // }
    // @GetMapping("/test")
    // public ResponseEntity<?> testAdmin(Authentication authentication) {
    // System.out.println("=== ADMIN ENDPOINT ACCESS ===");
    // System.out.println("User: " + authentication.getName());
    // System.out.println("Authorities: " + authentication.getAuthorities());
    // System.out.println("==============================");

    // return ResponseEntity.ok(Map.of(
    // "message", "Admin access successful",
    // "user", authentication.getName(),
    // "authorities", authentication.getAuthorities()));
    // }
}
