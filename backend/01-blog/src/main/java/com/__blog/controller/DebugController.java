package com.__blog.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.entity.User;
import com.__blog.repository.UserRepository;

@RestController
@RequestMapping("/dubg/posts")
public class DebugController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<?> checkAdminUser(@RequestBody PostRequest postRequest) {
        // Optional<User> adminUser = userRepository.findByEmail("admin@admin.com");
        System.out.println("Title: " + postRequest.getTitle());
        System.out.println("HTML Content: " + postRequest.getHtmlContent());
        System.out.println("Excerpt: " + postRequest.getExcerpt());
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
