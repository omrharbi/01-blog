package com.__blog.model.dto.response.auth;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
     private UUID id;
    private String username;
    private String email;
}