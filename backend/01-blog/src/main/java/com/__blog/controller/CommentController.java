package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.__blog.model.dto.request.CommentRequest;
import com.__blog.security.UserPrincipal;
import com.__blog.service.CommentService;

import jakarta.annotation.Nullable;
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
        return commentService.addComment(userPrincipal, commentRequest);
        // return ResponseEntity.ok(comment);
    }

    @GetMapping("/getCommentsWithPost/{postId}")
    public ResponseEntity<?> getCommentsWithPost(@PathVariable("postId") String postId, @AuthenticationPrincipal @Nullable UserPrincipal userPrincipal) {
            UUID userId = userPrincipal != null ? userPrincipal.getId() : null;
        
        return commentService.getCommentWithPost(postId, userId);
    }

    @PutMapping("editComment/{idComment}")
    public ResponseEntity<?> editComment(@PathVariable("idComment") String idComment, @Valid @RequestBody CommentRequest commentRequest, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return commentService.editComment(idComment, commentRequest, userPrincipal);
    }

    @DeleteMapping("delete/{idComment}")
    public ResponseEntity<?> delete(@PathVariable("idComment") String idComment) {
        return commentService.deleteComment(idComment);
    }
}
