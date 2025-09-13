package com.__blog.model.dto.request;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String fristname;
    private String lastname;
    private String about;
    private String profile_type;
    private Date date_of_birth;
    private String username;
    private String status;
    private String avatar;
}