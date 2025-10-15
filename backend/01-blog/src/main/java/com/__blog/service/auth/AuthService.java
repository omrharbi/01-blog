package com.__blog.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.auth.LoginRequest;
import com.__blog.model.dto.request.auth.RegisterRequest;
import com.__blog.model.dto.response.auth.LoginResponse;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Roles;
import com.__blog.repository.UserRepository;
import com.__blog.security.JwtTokenProvider;
import com.__blog.service.UserService;
import com.__blog.util.ApiResponse;

@Service
public class AuthService {

    @Autowired
    private UserRepository repouser;
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private JwtTokenProvider tokenProvider;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private UserService userService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public ApiResponse<RegisterRequest> registerUser(RegisterRequest registerRequest) {

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setFirstname(registerRequest.getFirstname());
        user.setLastname(registerRequest.getLastname());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setRole(Roles.USER);
        if (repouser.existsByEmail(user.getEmail())) {
            return ApiResponse.<RegisterRequest>builder().status(false)
                    .error("This email already exists: " + user.getEmail()).build();
        }
        if (repouser.existsByUsername(user.getUsername())) {
            return ApiResponse.<RegisterRequest>builder().status(false)
                    .error("This username  already exists: " + user.getUsername()).build();
        }
        String valid = userService.register(user);
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId());
        return ApiResponse.<RegisterRequest>builder()
                .status(true)
                .token(token)
                .message(valid)
                .build();
    }

    public ApiResponse<LoginResponse> verifyLoginUser(LoginRequest user) {

        ApiResponse<User> dbUser = user.getIdentifier().contains("@")
                ? userService.findByEmail(user.getIdentifier())
                : userService.findByUsername(user.getIdentifier());

        User userEntity = dbUser.getData();

        if (userEntity == null) {
            return ApiResponse.<LoginResponse>builder()
                    .status(false)
                    .error("User not found")
                    .build();
        }
        Authentication auth = manager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userEntity.getUsername(),
                        user.getPassword()));
        if (auth.isAuthenticated()) {
            // api

            String token = tokenProvider.generateToken(userEntity.getUsername(), userEntity.getRole().name(), userEntity.getId());
            LoginResponse response = new LoginResponse(
                    userEntity.getId(),
                    userEntity.getUsername(),
                    userEntity.getEmail(),
                    userEntity.getAvatarUrl()
            );

            return ApiResponse.<LoginResponse>builder()
                    .status(true)
                    .message("Login successful")
                    .token(token)
                    .data(response)
                    .build();
        }
        return ApiResponse.<LoginResponse>builder()
                .status(false)
                .error("Invalid credentials")
                .build();
    }

}
