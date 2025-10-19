package com.__blog.Component;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.User;

@Component
public class UserMapper {

    public UserResponse ConvertResponse(User user) {
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .avatar(user.getAvatarUrl())
                .about(user.getAbout())
                // .skills(user.getSkills())
                .username(user.getUsername())
                .build();
        return userResponse;
    }
}
