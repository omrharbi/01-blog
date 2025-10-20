package com.__blog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository repouser;
    // @Autowired
    @Autowired
    private UserMapper userMapper;

    public ApiResponse<User> finduser(UUID id) {
        var user = repouser.findById(id);
        if (user.isPresent()) {
            return ApiResponse.<User>builder()
                    .status(true).data(user.get()).build();
        } else {

            return ApiResponse.<User>builder().status(false).error("This user is not allowed or does not exist: " + id)
                    .build();
        }
    }

    public String register(User user) {
        if (repouser.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (repouser.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        repouser.save(user);
        return "register succss";
    }

    public ApiResponse<User> findByUsername(String username) {
        var user = repouser.findByUsername(username);
        if (user.isPresent()) {
            return ApiResponse.<User>builder().status(true).data(user.get()).build();
        } else {
            return ApiResponse.<User>builder().status(false)
                    .error("This user is not allowed or does not exist: " + username).build();

        }

    }

    public ApiResponse<User> findByEmail(String username) {
        var user = repouser.findByEmail(username);
        if (user.isPresent()) {
            return ApiResponse.<User>builder().status(true).data(user.get()).build();
        } else {
            return ApiResponse.<User>builder().status(false)
                    .error("This user is not allowed or does not exist: " + username).build();

        }
    }

    public ApiResponse<UserResponse> profile(UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        UserResponse userResponse = userMapper.ConvertResponse(user, user.getId());
        return ApiResponse.<UserResponse>builder().status(true)
                .data(userResponse).build();
    }

    // @Transactional
    public ApiResponse<List<UserResponse>> getAllUsers() {
        List<User> users = repouser.findAll();
        List<UserResponse> allUser = new ArrayList<>();
        for (var u : users) {

            UserResponse userResponses = userMapper.ConvertResponse(u, u.getId());
            allUser.add(userResponses);
        }
        return ApiResponse.<List<UserResponse>>builder()
                .status(true)
                .data(allUser)
                .build();
    }

    // public List
}
