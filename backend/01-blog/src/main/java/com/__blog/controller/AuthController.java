package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.RegisterRequest;
import com.__blog.model.entity.User;
import com.__blog.service.UserService;

@RestController
@RequestMapping("/user")
public class AuthController {
    @Autowired
    UserService userService;

    @PostMapping("/register")
    public String saveUser(@RequestBody RegisterRequest user) {
        userService.registerUser(user);
        return "succs";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return  userService.verifyLoginUser(user);
    }

}
