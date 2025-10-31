package com.__blog.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.service.AdminService;
import com.__blog.service.auth.AuthService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {
    @Autowired
    private AdminService userService;

    @GetMapping("/all-users")
    public ResponseEntity<?> AllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/AllPosts")
    public String AllPosts() {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/banUser")
    public String banUser() {
        // return userService.loginUser(user);
        return "";
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
