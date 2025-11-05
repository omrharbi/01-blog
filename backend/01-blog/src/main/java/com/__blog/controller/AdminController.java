package com.__blog.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.__blog.security.UserPrincipal;
import com.__blog.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    // @Transactional(re)

    @GetMapping("/count-users")
    public ResponseEntity<?> countUsers() {
        return adminService.countAllUser();
    }

    @GetMapping("/all-users")
    public ResponseEntity<?> allUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return adminService.getAllUsers(page, size);
    }

    @GetMapping("/admins")
    public ResponseEntity<?> getAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return adminService.getUsersAdmin(page, size);
    }

    @GetMapping("/active-users")
    public ResponseEntity<?> getActiveUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return adminService.getUsersActive(page, size);
    }

    @GetMapping("/banned-user")
    public ResponseEntity<?> bannedUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return adminService.getBannedUsers(page, size);
    }

    @PostMapping("/hidan-post/{postId}")
    public ResponseEntity<?> hidanPost(@PathVariable("postId") UUID postId) {

        return ResponseEntity.ok(null);
    }

    @PatchMapping("/ban-user/{userId}")
    public ResponseEntity<?> banUser(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("userId") UUID userId, @RequestParam("days") int days) {
        return adminService.banUser(userPrincipal, userId, days);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable("userId") UUID userId) {
        // System.out.println("AdminController.deleteUser()"+userId);
        return adminService.deleteUser(userId);
    }

    @PostMapping("/unban-user")
    public String UnbanUser() {
        // return userService.loginUser(user);
        return "";
    }

    @GetMapping("/all-posts")
    public ResponseEntity<?> allPosts(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return adminService.getAllPosts(page, size);
    }

    @DeleteMapping("/delete-posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable("postId") UUID postId) {
        return adminService.deletePost(postId);
    }

    @PatchMapping("/change-role/{userId}")
    public ResponseEntity<?> changeRole(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("userId") UUID userId) {
        return adminService.changeRole(userPrincipal, userId);
    }

    @PostMapping("/hiddeng-post/{postId}")
    public ResponseEntity<?> HiddengPost(@AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("postId") UUID postId) {
        return adminService.HiddengPost(userPrincipal, postId);
    }

}
