package com.__blog.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.service.posts.PostService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postservice;

    @PostMapping("/create-post")
    public Post createPost(@RequestBody PostRequest postRequest, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        // var response = postservice.createPost(postRequest, user);
        System.err.println(user.getId());
        return null;
    }
}
