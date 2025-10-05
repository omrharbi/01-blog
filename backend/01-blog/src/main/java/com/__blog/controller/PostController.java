package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.entity.Post;
import com.__blog.security.UserPrincipal;
import com.__blog.service.posts.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postservice;

    // private final UserRepository userRepository;
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody PostRequest postRequest,@AuthenticationPrincipal UserPrincipal userPrincipal) {
        // Optional<User> adminUser = userRepository.findByEmail("admin@admin.com");
    
        // System.out.println("User ID: ******" + userPrincipal.getId());
         Post post = postservice.createPost(postRequest, userPrincipal);
        // System.err.println(user.getId()+"id user");
        return ResponseEntity.ok(post);
    }
}
