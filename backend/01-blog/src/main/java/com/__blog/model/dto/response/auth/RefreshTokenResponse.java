package com.__blog.model.dto.response.auth;

import lombok.Data;

@Data
public class RefreshTokenResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";

    public RefreshTokenResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
