package com.__blog.service.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.__blog.exception.ApiException;
import com.__blog.model.dto.request.RegisterRequest;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Roles;
import com.__blog.repository.UserRepository;
import com.__blog.security.JwtTokenProvider;
import com.__blog.service.UserService;

import ch.qos.logback.core.subst.Token;
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
    private PasswordEncoder passwordEncoder;
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

    public String verifyLoginUser(User user) {
        Authentication auth = manager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (auth.isAuthenticated()) {
            User dbUser = userService.findByUsername(user.getUsername());
            return tokenProvider.generetToken(dbUser.getUsername(), dbUser.getRole().name());
        }
        return "faild";
    }

}
