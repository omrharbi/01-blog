package com.__blog.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.response.admin.UserResponseToAdmin;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class AdminService {
    // Add authentication-related methods here
    @Autowired
    private UserRepository repouser;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserMapper userMapper;

    public ResponseEntity<ApiResponse<List<UserResponseToAdmin>>> getAllUsers() {
        var user = repouser.findAllUsersWithPostCount();
        if (user == null) {
            return ApiResponseUtil.error("You Dont have any User", HttpStatus.BAD_REQUEST);
        }
        return ApiResponseUtil.success(user, null, "Registration successful");
    }

    public ResponseEntity<ApiResponse<List<UserResponseToAdmin>>> countUsers() {
        var countUser = repouser.count();
        var countPosts = postRepository.count();
        System.out.println("-----" + countPosts + " count user  " + countUser);
        // if (user == null) {
        // return ApiResponseUtil.error("You Dont have any User",
        // HttpStatus.BAD_REQUEST);
        // }
        return ApiResponseUtil.success(null, null, "Registration successful");
    }

    public ResponseEntity<ApiResponse<UserResponseToAdmin>> banUser(UUID userId) {
        var user = repouser.findById(userId);
        if (user.isPresent()) {
            user.get().setStatus("ban");
            var userResponse = repouser.save(user.get());
            var convertToResponse = userMapper.ConvertToResponseUserAdmin(userResponse);
            return ApiResponseUtil.success(convertToResponse, null, "Ban User successful");
        }
        return ApiResponseUtil.error("You Dont have any User", HttpStatus.BAD_REQUEST);
    }

    public ResponseEntity<ApiResponse<String>> deleteUser(UUID userId) {
        var user = repouser.findById(userId);
        if (user.isPresent()) {
            user.get().setStatus("ban");
            repouser.deleteById(user.get().getId());
            return ApiResponseUtil.success("delete User", null, "Delete User successful");
        }
        return ApiResponseUtil.error("You Dont have any User", HttpStatus.BAD_REQUEST);
    }
}