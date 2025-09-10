package com.__blog.service;

import org.hibernate.sql.exec.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.__blog.exception.ApiException;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository repouser;

    public User save_User(User user) {
        if (repouser.existsByEmail(user.getEmail())) {
            throw new ApiException("This email already exists: " + user.getEmail(), HttpStatus.BAD_REQUEST);
        }
        return repouser.save(user);
    }

    public User finduser(Integer id) {
        return repouser.findById(id).orElseThrow(() -> new ExecutionException("this user  not alowd" + id));
    }
}
