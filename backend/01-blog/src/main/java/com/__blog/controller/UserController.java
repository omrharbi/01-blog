package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.model.dto.request.auth.UpdateProfileRequest;
import com.__blog.security.UserPrincipal;
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
        return  userService.profile(username);

        // return ResponseEntity.ok(userProfile);
    }

    @GetMapping("/usersProfile/{username}/posts")
    public ResponseEntity<?> getAllMyPosts(@PathVariable("username") String username) {
        // return userService.findByUsername(username);
        return postService.getPostsFromUserId(username);
    }

    @GetMapping("/AllUser")
    public ResponseEntity<?> getUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping("/EditMyProfile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserPrincipal user,
            @ModelAttribute UpdateProfileRequest request,
            @RequestParam(value = "files", required = false) MultipartFile[] files) {
        return userService.updateProfile(user, request, files);
    }
}
