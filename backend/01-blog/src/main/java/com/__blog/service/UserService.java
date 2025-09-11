package com.__blog.service;

import org.hibernate.sql.exec.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.__blog.exception.ApiException;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repouser;
    @Autowired
    private AuthenticationManager manager;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User save_User(User user) {
        if (repouser.existsByEmail(user.getEmail())) {
            throw new ApiException("This email already exists: " + user.getEmail(), HttpStatus.BAD_REQUEST);
        }
        if (repouser.existsByUsername(user.getUsername())) {
            throw new ApiException("This username already exists: " + user.getUsername(), HttpStatus.BAD_REQUEST);
        }
        user.setPassword(encoder.encode(user.getPassword()));
        return repouser.save(user);
    }

    public String verifyLoginUser(User user) {
        Authentication auth = manager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (auth.isAuthenticated()) {
            return "succs";
        }
        return "faild";
    }

    public User finduser(Integer id) {
        return repouser.findById(id).orElseThrow(() -> new ExecutionException("this user  not alowd" + id));
    }

    public User findByUsername(String username) {
        return repouser.findByUsername(username)
                .orElseThrow(() -> new ExecutionException("this user  not alowd" + username));
    }
}
