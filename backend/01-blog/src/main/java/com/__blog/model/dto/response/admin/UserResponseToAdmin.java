package com.__blog.model.dto.response.admin;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import com.__blog.model.enums.Roles;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter

public class UserResponseToAdmin {

    private UUID id;
    private String username;
    private String status;
    private String email;
    private Long postsCount;
    private Roles role;
    private boolean hidden;
    private LocalDateTime hiddenUntil;
    private Date createAt;
    
    public UserResponseToAdmin(UUID id, String username, String status, String email, Long postsCount, Roles role,
            boolean hidden, LocalDateTime hiddenUntil , Date createAt) {
        this.id = id;
        this.username = username;
        this.status = status;
        this.email = email;
        this.postsCount = postsCount;
        this.role = role;
        this.hidden = hidden;
        this.hiddenUntil = hiddenUntil;
        this.createAt = createAt;
    }
}
