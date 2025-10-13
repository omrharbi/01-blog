package com.__blog.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.auth.RefreshTokenService;

@RestController
@RequestMapping("api/auth")
public class RefreshTokenController {

    @Autowired
    private RefreshTokenService tokenService;
    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refresheToken(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        var token = tokenService.createRefreshToken(userPrincipal.getId());

        return ResponseEntity.ok(token);
    }
}
