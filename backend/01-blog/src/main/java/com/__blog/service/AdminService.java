package com.__blog.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.response.admin.UserResponseToAdmin;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class AdminService {
    // Add authentication-related methods here
    @Autowired
    private UserRepository repouser;

    public ResponseEntity<ApiResponse<List<UserResponseToAdmin>>> getAllUsers() {
        var user = repouser.findAllUsersWithPostCount();
        if (user == null) {
            return ApiResponseUtil.error("You Dont have any User", HttpStatus.BAD_REQUEST);
        }
        return ApiResponseUtil.success(user, null, "Registration successful");
    }
}