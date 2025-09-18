package com.__blog.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.__blog.exception.ApiException;
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
    private UserService userService;
    // @Autowired
    // private PasswordEncoder passwordEncoder;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User registerUser(RegisterRequest registerRequest) {

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setFristname(registerRequest.getFristname());
        user.setLastname(registerRequest.getLastname());
        user.setAbout(registerRequest.getAbout());
        user.setDate_of_birth(registerRequest.getDate_of_birth());
        user.setUsername(registerRequest.getUsername());
        user.setAvatar(registerRequest.getAvatar());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setRole(Roles.USER);

        if (repouser.existsByEmail(user.getEmail())) {
            throw new ApiException("This email already exists: " + user.getEmail(), HttpStatus.BAD_REQUEST);
        }
        if (repouser.existsByUsername(user.getUsername())) {
            throw new ApiException("This username already exists: " + user.getUsername(), HttpStatus.BAD_REQUEST);
        }

        // user.setPassword(encoder.encode(user.getPassword()));
        return repouser.save(user);
    }

   public ResponseEntity<ApiResponse<LoginResponse>> verifyLoginUser(LoginRequest user) {
    try {
        User dbUser = user.getIdentifier().contains("@")
                ? userService.findByEmail(user.getIdentifier())
                : userService.findByUsername(user.getIdentifier());

        if (dbUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<LoginResponse>builder()
                            .status(false)
                            .error("User not found")
                            .build());
        }

        Authentication auth = manager.authenticate(
                new UsernamePasswordAuthenticationToken(dbUser.getUsername(), user.getPassword())
        );

        if (auth.isAuthenticated()) {
            String token = tokenProvider.generetToken(dbUser.getUsername(), dbUser.getRole().name());

            LoginResponse loginResponse = new LoginResponse(
                    dbUser.getId(),
                    dbUser.getUsername(),
                    dbUser.getEmail()
            );

            return ResponseEntity.ok(
                    ApiResponse.<LoginResponse>builder()
                            .status(true)
                            .message("Login successful")
                            .token(token)
                            .data(loginResponse)
                            .build()
            );
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.<LoginResponse>builder()
                        .status(false)
                        .error("Invalid credentials")
                        .build());

    } catch (Exception e) {
        // Catch unexpected errors (like SQL executor problems)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<LoginResponse>builder()
                        .status(false)
                        .error("An unexpected error occurred: " + e.getMessage())
                        .build());
    }
}

}
