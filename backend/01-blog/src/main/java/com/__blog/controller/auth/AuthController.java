package com.__blog.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.LoginRequest;
import com.__blog.model.dto.request.RegisterRequest;
import com.__blog.service.auth.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest user) {
        return userService.verifyLoginUser(user);
    }

    // @GetMapping("/test")
    // public ResponseEntity<?> testAdmin(Authentication authentication) {
    // System.out.println("=== user ENDPOINT ACCESS ===");
    // System.out.println("User: " + authentication.getName());
    // System.out.println("Authorities: " + authentication.getAuthorities());
    // System.out.println("==============================");

    // return ResponseEntity.ok(Map.of(
    // "message", "user access successful",
    // "user", authentication.getName(),
    // "authorities", authentication.getAuthorities()));
    // }
}
