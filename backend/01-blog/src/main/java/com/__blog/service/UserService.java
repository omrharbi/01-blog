package com.__blog.service;

import org.hibernate.sql.exec.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired; 
import org.springframework.stereotype.Service;
 
import com.__blog.model.entity.User;
 import com.__blog.repository.UserRepository; 

@Service
public class UserService {

    @Autowired
    private UserRepository repouser;

    public User finduser(Integer id) {
        return repouser.findById(id).orElseThrow(() -> new ExecutionException("this user  not alowd" + id));
    }

    public User findByUsername(String username) {
        return repouser.findByUsername(username)
                .orElseThrow(() -> new ExecutionException("this user  not alowd" + username));
    }
}
