package com.__blog.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.__blog.model.dto.request.auth.UpdateProfileRequest;
import com.__blog.security.UserPrincipal;
import com.__blog.service.UserService;
import com.__blog.service.posts.PostService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
        return userService.profile(username);
    }

    @GetMapping("/usersProfile/{username}/posts")
    public ResponseEntity<?> getAllMyPosts(@PathVariable("username") String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime snapshotTime,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return postService.getPostsFromUserUsername(username, snapshotTime, page, size);
    }

    @GetMapping("/AllUser")
    public ResponseEntity<?> getUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping(value = "/edit-profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(value = "request", required = false) String requestJsonString,
            @RequestPart(value = "files", required = false) MultipartFile[] files) throws JsonProcessingException {

        // System.out.println("File name: " + requestJson.getAbout());
        ObjectMapper objectMapper = new ObjectMapper();
        UpdateProfileRequest requestJson = objectMapper.readValue(requestJsonString, UpdateProfileRequest.class);
        System.out.println("Received files count: " + requestJson);

        if (files != null) {
            System.out.println("Received files count: " + files.length);
            for (MultipartFile file : files) {
                System.out.println("File name: " + file.getOriginalFilename());
            }
        } else {
            System.out.println("No files received");
        }

        return userService.updateProfile(user, requestJson, files);
        // return ResponseEntity.ok(null);
    }
}
