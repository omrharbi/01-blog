package com.__blog.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    // @Autowired
    // AuthService userService;

    // @PostMapping("/login")
    // public String login(@RequestBody LoginRequest user) {
    //     return userService.loginUser(user);
    // }

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
