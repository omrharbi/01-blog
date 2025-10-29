package com.__blog.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;

import jakarta.transaction.Transactional;

@Service
public class UserDeService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) {

        Optional<User> user = userRepo.findByUsername(username);
        if(user.isPresent()){
            return new UserPrincipal(user.get());

        }
        return  null;

    }

}