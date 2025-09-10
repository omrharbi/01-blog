package com.__blog.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {
    private final HttpStatus httpstatus;

    public ApiException(String message, HttpStatus status) {
        super(message);
        this.httpstatus = status;
    }

    public HttpStatus getHttpStatus() {
        return httpstatus;
    }
}
