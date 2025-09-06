package com.__blog.service;

import org.hibernate.sql.exec.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.response.UserRepo;
import com.__blog.model.entity.User;
@Service
public class UserService {

    @Autowired
    UserRepo repouser;

    public User save_User(User user) {
        return repouser.save(user);
    }
    public User finduser(Integer  id){
        return  repouser.findById(id).orElseThrow(()->new  ExecutionException("this user  not alowd"+id));
    }
}
