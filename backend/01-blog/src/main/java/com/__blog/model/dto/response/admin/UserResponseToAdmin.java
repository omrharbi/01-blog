package com.__blog.model.dto.response.admin;

import java.sql.Date;
import java.util.UUID;
import lombok.Builder;
import lombok.Data;

@Builder
@Data

public class UserResponseToAdmin {
    private UUID id;
    private String username;
    private String status;
    private String email;
    private Long postsCount;

    public UserResponseToAdmin(UUID id, String username, String status, String email,  Long postsCount) {
        this.id = id;
        this.username = username;
        this.status = status;
        this.email = email;
        // this.createAt = createAt;
        this.postsCount = postsCount;
    }
}
