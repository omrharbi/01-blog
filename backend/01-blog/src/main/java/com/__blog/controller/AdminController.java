package com.__blog.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.entity.User;
import com.__blog.service.UserService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    UserService userService;

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.verifyLoginUser(user);
    }

    @GetMapping("/test")
    public ResponseEntity<?> testAdmin(Authentication authentication) {
        System.out.println("=== ADMIN ENDPOINT ACCESS ===");
        System.out.println("User: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
        System.out.println("==============================");

        return ResponseEntity.ok(Map.of(
                "message", "Admin access successful",
                "user", authentication.getName(),
                "authorities", authentication.getAuthorities()));
    }
}
