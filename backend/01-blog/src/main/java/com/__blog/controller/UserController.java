package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.service.UserService;
import com.__blog.service.posts.PostService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
// @Transactional
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    PostService postService;

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> profile(@PathVariable("username") String username) {
        // return userService.findByUsername(username);
        var userProfile = userService.profile(username);

        return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/usersProfile/{username}/posts")
    public ResponseEntity<?> getAllMyPosts(@PathVariable("username") String username) {
        // return userService.findByUsername(username);
        var posts = postService.getPostsFromUserId(username);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/AllUser")
    public ResponseEntity<?> getUsers() {
        var users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }
    // @PutMapping("/{userId}/profile")
    // public ResponseEntity<UserProfileResponse> updateProfile(
    // @PathVariable UUID userId,
    // @RequestBody UpdateProfileRequest request) {
    // User updatedUser = userService.updateProfile(userId, request);
    // UserProfileResponse response = mapToResponse(updatedUser);
    // return ResponseEntity.ok(response);
    // }
}
