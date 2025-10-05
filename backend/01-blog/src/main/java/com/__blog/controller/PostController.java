package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.response.PostResponse;
import com.__blog.security.UserPrincipal;
import com.__blog.service.posts.PostService;
import com.__blog.util.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postservice;

    // private final UserRepository userRepository;
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest,@AuthenticationPrincipal UserPrincipal userPrincipal) {
 
         ApiResponse<PostResponse> post = postservice.createPost(postRequest, userPrincipal);
         return ResponseEntity.ok(post);
    }
}
