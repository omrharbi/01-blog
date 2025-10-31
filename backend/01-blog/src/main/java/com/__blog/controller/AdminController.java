package com.__blog.controller;


import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.service.AdminService;

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

    @GetMapping("/count-users")
    public ResponseEntity<?> countUsers() {
        return userService.countUsers();
    }
    @PostMapping("/AllPosts")
    public String AllPosts() {
        // return userService.loginUser(user);
        return "";
    }

    @PostMapping("/banUser/{userId}")
    public ResponseEntity<?> banUser(@PathVariable("userId") UUID userId) {
        return userService.banUser(userId);
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
