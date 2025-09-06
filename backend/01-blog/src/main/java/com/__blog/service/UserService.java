package com.__blog.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.__blog.model.dto.response.UserRepo;
import com.__blog.model.entity.User;

public class UserService {

    @Autowired
    UserRepo repouser;

    public User save_User(User user) {
        return repouser.save(user);
    }
}
