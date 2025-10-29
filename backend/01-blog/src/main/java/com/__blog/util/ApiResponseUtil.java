package com.__blog.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ApiResponseUtil {

    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String token, String message) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .status(true)
                .data(data)
                .token(token)
                .message(message)
                .build();
        return ResponseEntity.ok(response);
    }

    public static <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus stauts) {
        ApiResponse<T> response = ApiResponse.<T>builder()
                .status(false)
                .error(message)
                .build();
        return ResponseEntity.status(stauts).body(response);
    }
}
