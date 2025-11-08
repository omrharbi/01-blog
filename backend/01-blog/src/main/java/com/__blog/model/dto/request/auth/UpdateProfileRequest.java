package com.__blog.model.dto.request.auth;

import java.util.Set;

 import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
public class UpdateProfileRequest {
    private String email;
    private String firstname;
    private String lastname;
    private String about;
    private String username;
    // private String avatar;
    private Set<String> skills ;
}
