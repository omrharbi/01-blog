package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.UserService;
import com.__blog.service.posts.PostService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    PostService postService;

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        // return userService.findByUsername(username);
        var userProfile = userService.profile(userPrincipal);

        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/getAllPosts")
    public ResponseEntity<?> getAllPosts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        // return userService.findByUsername(username);
        var posts = postService.getPostsFromUserId(userPrincipal.getId());

        return ResponseEntity.ok(posts);
    }

}
