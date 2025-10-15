package com.__blog.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;

@Service
public class UserService {

    @Autowired
    private UserRepository repouser;

    public ApiResponse<User> finduser(UUID id) {
        var user = repouser.findById(id);// .orElseThrow(() -> new ExecutionException("this user not alowd" + id));
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
}
