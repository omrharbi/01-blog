package com.__blog.controller;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;

@RestController
@RequestMapping("/debug")
public class DebugController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/admin-user")
    public ResponseEntity<?> checkAdminUser() {
        Optional<User> adminUser = userRepository.findByEmail("admin@admin.com");
        if (adminUser.isPresent()) {
            User admin = adminUser.get();
            return ResponseEntity.ok(Map.of(
                "email", admin.getEmail(),
                "role", admin.getRole(),
                "id", admin.getId()
            ));
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users.stream().map(user -> Map.of(
            "email", user.getEmail(),
            "role", user.getRole(),
            "id", user.getId()
        )).collect(Collectors.toList()));
    }
}