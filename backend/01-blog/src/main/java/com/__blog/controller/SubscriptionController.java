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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.SubscriptionService;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    // Get users I follow
    @GetMapping("/following")
    public ResponseEntity<?> getUsersIFollow(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return subscriptionService.getUsersIFollow(userPrincipal.getId(), page, size);
    }

    // Get my followers
    @GetMapping("/followers")
    public ResponseEntity<?> getFollowers(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return subscriptionService.getFollowers(userPrincipal, page, size);
    }

    @GetMapping("/is_i_following/{username}")
    public ResponseEntity<?> getUserIsFollow(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable("username") String username) {
        return subscriptionService.getUSerIsFollow(userPrincipal, username);
    }

    // Get users I DON'T follow (for Explore page)
    @GetMapping("/explore")
    public ResponseEntity<?> getExploreUsers(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return subscriptionService.getUsersNotFollowing(userPrincipal, page, size);
    }

    // Follow a user
    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<?> followUser(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID targetUserId) {
        return subscriptionService.followUser(userPrincipal, targetUserId);
    }

    // Unfollow a user
    @DeleteMapping("/unfollow/{targetUserId}")
    public ResponseEntity<?> unfollowUser(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable UUID targetUserId) {
        return subscriptionService.unfollowUser(userPrincipal, targetUserId);
    }
}
