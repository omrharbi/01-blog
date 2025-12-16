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
       var  data= userService.register(user); 
        String token = tokenProvider.generateToken(user.getUsername(), user.getRole().name(), user.getId());
        return ApiResponseUtil.success(data, token, "register success");
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
