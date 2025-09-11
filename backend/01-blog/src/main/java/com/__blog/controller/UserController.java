package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.entity.User;
import com.__blog.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/register")
    public String saveUser(@RequestBody User user) {
        userService.save_User(user);
        return "succs";
    }

    @GetMapping("/login")
    public String getUser(@RequestBody User user) {
        return  verifyLoginUser(user);
    }
}
