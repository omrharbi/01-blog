package com.__blog.service;

 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.__blog.model.entity.User;
import com.__blog.model.entity.UserPrancipal;
import com.__blog.repository.UserRepository;
@Service
public class UserDeService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        if (user == null) {
            throw new UsernameNotFoundException("user name not found");
        }

        return new UserPrancipal(user);
    }

}