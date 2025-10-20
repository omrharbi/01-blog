package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.LikeService;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/toggleLikePost/{target}")
    public ResponseEntity<?> toggleLikePost(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable UUID target) {
        var like = likeService.toggleLikePost(userPrincipal.getId(), target);

        return ResponseEntity.ok(like);
    }
}
