package com.__blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.__blog.exception.ApiException;
import com.__blog.model.entity.User;
import com.__blog.model.entity.UserPrancipal;
import com.__blog.repository.UserRepository;

@Service
public class UserDeService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ApiException("Error this username: " + username, HttpStatus.BAD_REQUEST));
        if (user == null) {
            throw new ApiException("Not Found: " + username, HttpStatus.NOT_FOUND);
        }

        return new UserPrancipal(user);
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, UserDeService userDeService)
            throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDeService)
                .passwordEncoder(passwordEncoder()) // important
                .and()
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

}