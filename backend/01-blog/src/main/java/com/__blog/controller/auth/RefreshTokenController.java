package com.__blog.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.auth.RefreshTokenRequest;
import com.__blog.service.auth.RefreshTokenService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/auth")
public class RefreshTokenController {

    @Autowired
    private RefreshTokenService tokenService;

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refresheToken(@Valid @RequestBody RefreshTokenRequest request) {
        try {
            var token = tokenService.refreshAccessToken(request.getRefreshToken());

            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e);
        }
    }
}
