package com.__blog.model.dto.response.auth;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class LoginResponse {
     private UUID id;
    private String username;
    private String email;
    private String avater;
}