package com.__blog.service.auth;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.request.auth.LoginRequest;
import com.__blog.model.dto.request.auth.RegisterRequest;
import com.__blog.model.dto.response.auth.LoginResponse;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;
import com.__blog.security.JwtTokenProvider;
import com.__blog.service.UserService;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

import jakarta.validation.Valid;

@Service
public class AuthService {

    @Autowired
    private UserRepository repouser;
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private JwtTokenProvider tokenProvider;
    // @Autowired
    // private RefreshTokenService refreshTokenService;

    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;

    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userMapper.ConvertToEntity(registerRequest);
        if (repouser.existsByEmail(user.getEmail())) {
            return ApiResponseUtil.error("This email already exists:" + user.getEmail(), HttpStatus.NOT_FOUND);
        }
        if (repouser.existsByUsername(user.getUsername())) {
            return ApiResponseUtil.error("This username  already exists: " + user.getUsername(), HttpStatus.NOT_FOUND);

        }
        return  register(user);
        // String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId());
        // return ApiResponseUtil.success(data, token, "register success");
    }

    private ResponseEntity<ApiResponse<User>> register(User user) {

        String username = user.getUsername();

        // --- USERNAME VALIDATION ---
        System.out.println("Validating username: *-*-*-*-*-*-*-* " + username);

        // Null / empty
        if (username == null || username.trim().isEmpty()) {
            return ApiResponseUtil.error("Username cannot be empty", HttpStatus.BAD_REQUEST);
        }
        System.out.println("Validating username: 1 " + username);

        // Min length
        if (username.length() < 3) {
            return ApiResponseUtil.error("Username must be at least 3 characters long", HttpStatus.BAD_REQUEST);
        }
        System.out.println("Validating username: *2" + username);

        // Cannot contain '@'
        if (username.contains("@")) {
            return ApiResponseUtil.error("Username cannot contain '@' symbol", HttpStatus.BAD_REQUEST);
        }
        System.out.println("Validating username: *3 " + username);

        // Optional: only allow letters, numbers, underscore
        if (!username.matches("^[a-zA-Z0-9_]+$")) {
            System.out.println("Validating username: *4" + username);
            return ApiResponseUtil.error(
                    "Username can only contain letters, numbers, and underscore (_)",
                    HttpStatus.BAD_REQUEST);
        }

        // ---- Existing email check ----
        if (repouser.existsByEmail(user.getEmail())) {
            return ApiResponseUtil.error("Email already exists", HttpStatus.CONFLICT);
        }
        System.out.println("Validating username: *5" + username);

        // ---- Existing username check ----
        if (repouser.existsByUsername(username)) {
            return ApiResponseUtil.error("Username already exists", HttpStatus.CONFLICT);
        }
        System.out.println("Validating username: *6" + username);

        // ---- Save user ----
        repouser.save(user);

        return ApiResponseUtil.success(user, null, "Registration successful");
    }

    public ResponseEntity<ApiResponse<LoginResponse>> verifyLoginUser(LoginRequest user) {

        ResponseEntity<ApiResponse<User>> getUserFromDb = user.getIdentifier().contains("@")
                ? userService.findByEmail(user.getIdentifier())
                : userService.findByUsername(user.getIdentifier());
        ApiResponse<User> dbUserResponse = getUserFromDb.getBody();
        if (dbUserResponse == null || dbUserResponse.getData() == null) {
            return ApiResponseUtil.error("No account found with the provided username or email.", HttpStatus.NOT_FOUND);
        }

        if (dbUserResponse.getData().isHidden() && dbUserResponse.getData().getHiddenUntil() != null
                && dbUserResponse.getData().getHiddenUntil().isAfter(LocalDateTime.now())) {

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            var date = dbUserResponse.getData().getHiddenUntil().format(formatter);
            return ApiResponseUtil.error("Your account is temporarily banned until " + date, HttpStatus.FORBIDDEN);
        }

        User userEntity = dbUserResponse.getData();

        if (userEntity == null) {

            return ApiResponseUtil.error("UserName Or Email Invalid ", HttpStatus.BAD_REQUEST);
        }
        try {

            Authentication auth = manager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userEntity.getUsername(),
                            user.getPassword()));
            if (auth.isAuthenticated()) {
                String token = tokenProvider.generateToken(userEntity.getUsername(),
                        userEntity.getRole().name(), userEntity.getId());
                LoginResponse response = LoginResponse.builder()
                        .id(userEntity.getId())
                        .username(userEntity.getUsername())
                        .email(userEntity.getEmail())
                        .avater(userEntity.getAvatarUrl())
                        .build();

                return ApiResponseUtil.success(response, token, "");

            }

        } catch (Exception e) {
            return ApiResponseUtil.error("Invalid credentials", HttpStatus.BAD_REQUEST);
        }
        return ApiResponseUtil.error("Invalid credentials", HttpStatus.UNAUTHORIZED);

        // return ApiResponse.<LoginResponse>builder()
        // .status(false)
        // .error("Invalid credentials")
        // .build();
    }

}
