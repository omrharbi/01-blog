package com.__blog.model.dto.request.auth;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@AllArgsConstructor
public class UpdateProfileRequest {
    private String email;
    private String firstname;
    private String lastname;
    private String about;
    private String username;
    private String avatar;
    private Set<String> skills ;
}
