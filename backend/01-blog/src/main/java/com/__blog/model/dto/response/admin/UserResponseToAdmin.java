package com.__blog.model.dto.response.admin;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import com.__blog.model.enums.Roles;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class UserResponseToAdmin {

    private UUID id;
    private String username;
    private String firstname;
    private String lastname;
    private String status;
    private String email;
    private Long postsCount;
    private Roles role;
    private boolean hidden;
    private LocalDateTime hiddenUntil;
    private Date createAt;
}
