package com.__blog.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postservice;
 
    @PostMapping("/create")
    public ResponseEntity<?> createPost(@Valid @RequestBody PostRequest postRequest, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApiResponse<PostResponse> post = postservice.createPost(postRequest, userPrincipal);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/getallPost")
    public ResponseEntity<?> getPosts() {

        ApiResponse<List<PostResponse>> post = postservice.getPosts();

        return ResponseEntity.ok(post);
    }

    @GetMapping("/getPostById/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(@PathVariable int id) {

        try {
            if (id <= 0) {
                return ResponseEntity.badRequest().body(ApiResponse.<PostResponse>builder()
                        .status(false)
                        .error("Invalid post ID " + id)
                        .build()
                );
            }
            ApiResponse<PostResponse> getpost = postservice.getPostById(id);

            if (getpost.getData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<PostResponse>builder().status(false).error("Post not found with ID: " + id).build());
            }
            return ResponseEntity.ok(getpost);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<PostResponse>builder()
                    .status(false)
                    .error("Post not found with ID:" + id)
                    .build()
            );
        }
    }
}
