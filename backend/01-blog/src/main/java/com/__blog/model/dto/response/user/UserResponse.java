package com.__blog.model.dto.response.user;

import java.util.Set;
import java.util.UUID;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Transactional
public class UserResponse {

    private UUID id;
    private String firstname;
    private String lastname;
    private String about;
    private String username;
    private String avatar;
    private Set<String> skills;
    private int followersCount;
    private int followingCount;
    private boolean followingMe;
    private int postsCount;
}
