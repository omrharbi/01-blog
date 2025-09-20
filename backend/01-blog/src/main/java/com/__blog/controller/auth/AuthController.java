package com.__blog.controller.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.auth.LoginRequest;
import com.__blog.model.dto.request.auth.RegisterRequest;
import com.__blog.model.dto.response.auth.LoginResponse;
import com.__blog.service.auth.AuthService;
import com.__blog.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterRequest>> register(@RequestBody RegisterRequest request) {
        ApiResponse<RegisterRequest> userresponse = userService.registerUser(request);
        return ResponseEntity.ok(userresponse);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest user) {
        ApiResponse<LoginResponse> response = userService.verifyLoginUser(user);
        return ResponseEntity.ok(response);
    }
 
}
