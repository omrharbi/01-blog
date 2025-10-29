package com.__blog.util;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApiResponse<T> {

    private boolean status;
    private String message;
    private String error;
    private String token;
    // private String refreshToken;
    private T data;

    // public ApiResponse<T> ApiResponse() {

    // }
}
