package com.__blog.model.dto.request.auth;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String refreshToken;
}