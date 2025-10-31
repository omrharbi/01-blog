package com.__blog.model.dto.response.admin;

import java.util.Date;
import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Data

public class UserResponseToAdmin {
    private UUID id;
    private String username;
    private String status;
    private String email;
    // private Date createAt;
    private Long  postsCount;
  
   
    public UserResponseToAdmin(UUID id, String username, String status, String email, Long postsCount) {
        this.id = id;
        this.username = username;
        this.status = status;
        this.email = email;
        this.postsCount = postsCount;
    }
}
