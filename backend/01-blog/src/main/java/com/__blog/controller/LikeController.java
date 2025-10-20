package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.service.LikeService;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/toggleLikePost/{userid}/{target}")
    public ResponseEntity<?> toggleLikePost(@PathVariable UUID userid, @PathVariable UUID target) {
        var like = likeService.toggleLikePost(userid, target);

        return ResponseEntity.ok(like);
    }
}
