package com.__blog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.model.dto.request.CommentRequest;
import com.__blog.security.UserPrincipal;
import com.__blog.service.CommentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin

public class CommentController {

    
    @Autowired
    private CommentService commentService;
    @PostMapping("/create")
    public ResponseEntity<?> addComment(@Valid @RequestBody CommentRequest commentRequest,
     @AuthenticationPrincipal UserPrincipal userPrincipal) {
        System.out.println("CommentController.AddComment()" + userPrincipal.getUsername() + "*****" + commentRequest.getContent());
        var comment = commentService.AddComment(userPrincipal, commentRequest);
        return ResponseEntity.ok(comment);
    }

    //  @PostMapping("/create")
}
