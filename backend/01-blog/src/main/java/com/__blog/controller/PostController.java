package com.__blog.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.response.post.PostResponse;
import com.__blog.model.dto.response.post.PostResponseWithMedia;
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

    @PutMapping("/post/edit/{postid}")
    public ResponseEntity<?> editPost(@PathVariable("postid") UUID postId, @RequestBody PostRequest postRequest, @AuthenticationPrincipal UserPrincipal userPrincipa) {
        ApiResponse<PostResponse> post = postservice.editPost(postRequest, postId, userPrincipa.getId());
        return ResponseEntity.ok(post);
    }

    @GetMapping("/getallPost")
    public ResponseEntity<?> getPosts(@AuthenticationPrincipal UserPrincipal userPrincipal) {

        ApiResponse<List<PostResponse>> post = postservice.getPosts(userPrincipal.getId());

        return ResponseEntity.ok(post);
    }

    @GetMapping("/getPostById/{id}")
    public ResponseEntity<ApiResponse<PostResponseWithMedia>> getPostById(@PathVariable UUID id, @AuthenticationPrincipal UserPrincipal userPrincipa) {

        try {
            if (id.equals(new UUID(0, 0))) {
                return ResponseEntity.badRequest().body(ApiResponse.<PostResponseWithMedia>builder()
                        .status(false)
                        .error("Invalid post ID " + id)
                        .build()
                );
            }
            ApiResponse<PostResponseWithMedia> getpost = postservice.getPostById(id, userPrincipa.getId());

            if (getpost.getData() == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.<PostResponseWithMedia>builder().status(false).error("Post not found with ID: " + id).build());
            }
            return ResponseEntity.ok(getpost);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<PostResponseWithMedia>builder()
                    .status(false)
                    .error("Post not found with ID:" + id)
                    .build()
            );
        }
    }



    @DeleteMapping("/post/delete/{postid}")
    public ResponseEntity<?> deletePost(@PathVariable("postid") UUID postId, @AuthenticationPrincipal UserPrincipal userPrincipa) {
        ApiResponse<List<PostResponse>> post = postservice.deletePost(postId, userPrincipa.getId());
        return ResponseEntity.ok(post);
    }
    
}
