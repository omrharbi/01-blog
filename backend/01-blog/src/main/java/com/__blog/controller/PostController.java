package com.__blog.controller;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.response.post.PostResponseWithMedia;
import com.__blog.security.UserPrincipal;
import com.__blog.service.posts.PostService;
import com.__blog.util.ApiResponse;

import jakarta.annotation.Nullable;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postservice;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return postservice.createPost(postRequest, userPrincipal);
    }

    @PutMapping("/post/edit/{postid}")
    public ResponseEntity<?> editPost(@PathVariable("postid") String postId, @RequestBody PostRequest postRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipa) {
        return postservice.editPost(postRequest, postId, userPrincipa);
    }

    @GetMapping("/getallPost")
    public ResponseEntity<?> getPosts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime snapshotTime,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        UUID userId = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal) {
            userId = ((UserPrincipal) auth.getPrincipal()).getId();
            System.err.println("Authenticated userId: " + userId);
        } else {
            System.err.println("Anonymous request, userId is null");
        }
        System.err.println("userId in getPosts: " + userId);

        return postservice.getPosts(userId, snapshotTime, page, size);

    }

    @GetMapping("/getPostById/{id}")
    public ResponseEntity<ApiResponse<PostResponseWithMedia>> getPostById(
            @AuthenticationPrincipal @Nullable UserPrincipal userPrincipal, @PathVariable String id) {

        try {

            UUID userId = userPrincipal != null ? userPrincipal.getId() : null;

            ResponseEntity<ApiResponse<PostResponseWithMedia>> getPostResponse = postservice.getPostById(id, userId);
            ApiResponse<PostResponseWithMedia> postBody = getPostResponse.getBody();

            if (postBody == null || postBody.getData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<PostResponseWithMedia>builder()
                                .status(false)
                                .error("Post not found with ID: " + id)
                                .build());
            }

            return ResponseEntity.ok(postBody);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<PostResponseWithMedia>builder()
                    .status(false)
                    .error("Post not found with ID:" + id)
                    .build());
        }
    }

    @DeleteMapping("/post/delete/{postid}")
    public ResponseEntity<ApiResponse<String>> deletePost(@PathVariable("postid") UUID postId) {
        return postservice.deletePost(postId);
    }

}
