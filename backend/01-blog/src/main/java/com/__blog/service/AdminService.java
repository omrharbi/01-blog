package com.__blog.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.admin.UserResponseToAdmin;
import com.__blog.model.dto.response.admin.UsersPostsReportCountResponse;
import com.__blog.model.dto.response.post.PostReportToAdminResponse;
import com.__blog.model.entity.Report;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Notifications;
import com.__blog.model.enums.Roles;
import com.__blog.repository.PostRepository;
import com.__blog.repository.ReportRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

import jakarta.transaction.Transactional;
import lombok.NonNull;

@Service
@Transactional
public class AdminService {

    // Add authentication-related methods here
    @Autowired
    private UserRepository repouser;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private NotificationService notificationService;

    // Returns a paginated list of all users.
    public ResponseEntity<ApiResponse<Page<UserResponseToAdmin>>> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = repouser.findAll(pageable);
        Page<UserResponseToAdmin> userResponsePage = users.map(u -> userMapper.ConvertResponseToAdmin(u, u.getId()));
        return ApiResponseUtil.success(userResponsePage, null, "All users retrieved successfully");
    }

    // Returns a paginated list of all Admin.
    public ResponseEntity<ApiResponse<Page<UserResponseToAdmin>>> getUsersAdmin(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = repouser.findByRole(Roles.ADMIN, pageable);
        Page<UserResponseToAdmin> userResponsePage = users.map(u -> userMapper.ConvertResponseToAdmin(u, u.getId()));
        return ApiResponseUtil.success(userResponsePage, null, "All users retrieved successfully");
    }
    // Returns a paginated list of all user Active.

    public ResponseEntity<ApiResponse<Page<UserResponseToAdmin>>> getUsersActive(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = repouser.findByHidden(false, pageable);
        Page<UserResponseToAdmin> userResponsePage = users.map(u -> userMapper.ConvertResponseToAdmin(u, u.getId()));
        return ApiResponseUtil.success(userResponsePage, null, "All users retrieved successfully");
    }
    // Returns a paginated list of all user banned User .

    public ResponseEntity<ApiResponse<Page<UserResponseToAdmin>>> getBannedUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = repouser.findByHidden(true, pageable);
        Page<UserResponseToAdmin> userResponsePage = users.map(u -> userMapper.ConvertResponseToAdmin(u, u.getId()));
        return ApiResponseUtil.success(userResponsePage, null, "All users retrieved successfully");
    }
    // Returns a paginated list of all Posts .

    public ResponseEntity<ApiResponse<Page<PostReportToAdminResponse>>> getAllPosts(int page, int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            var posts = postRepository.getPostsReportForAdmin(pageable);
            if (posts == null) {
                return ApiResponseUtil.success(null, null, "No User");
            }

            return ApiResponseUtil.success(posts, null, "Get All Users successful");
        } catch (Exception e) {
            return ApiResponseUtil.error("Somting Woring", HttpStatus.BAD_REQUEST);
        }
    }
    // Returns a paginated list of all count user .

    @Transactional
    public ResponseEntity<ApiResponse<UsersPostsReportCountResponse>> countAllUser() {
        var countUser = repouser.count();
        var countPosts = postRepository.count();
        var countReport = reportRepository.count();
        UsersPostsReportCountResponse countResponse = UsersPostsReportCountResponse.builder()
                .countPosts(countPosts)
                .countReport(countReport)
                .countUser(countUser)
                .build();
        return ApiResponseUtil.success(countResponse, null, null);
    }

    @Transactional
    public ResponseEntity<ApiResponse<UserResponseToAdmin>> banUser(UserPrincipal userPrincipal, UUID userId,
            int days) {

        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error(
                        "❌ You are not authorized to ban this user.",
                        HttpStatus.UNAUTHORIZED);
            }
            User admin = userPrincipal.getUser();
            var userOptional = repouser.findById(userId);

            if (userOptional.isEmpty()) {
                return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            if (admin.getId().equals(user.getId())) {
                return ApiResponseUtil.error("You Can Not Banne Your Account ", HttpStatus.BAD_REQUEST);
            }

            boolean wasHidden = user.isHidden();

            String message;
            if (wasHidden) {
                Optional<Report> reportedOptional = reportRepository.findByReportedUser_Id(userId);
                reportedOptional.ifPresent(report -> report.setStatus(false));
                user.setHidden(false);
                message = user.getUsername() + ", your Account has been unhidden.";
            } else {
                user.setHidden(true);
                Optional<Report> reportedOptional = reportRepository.findByReportedUser_Id(userId);
                reportedOptional.ifPresent(report -> report.setStatus(true));
                message = user.getUsername() + ", your Account has been banned.";
                user.setHiddenUntil(LocalDateTime.now().plusDays(days));
            }
            var userResponse = repouser.save(user);
            var convertToResponse = userMapper.ConvertToResponseUserAdmin(userResponse);

            NotificationRequest requestNotificationRequest = NotificationRequest.builder()
                    .type(Notifications.USER_BANNED)
                    .triggerUserId(admin.getId())
                    .receiverId(userId)
                    .message(message)
                    .build();
            notificationService.saveAndSendNotification(requestNotificationRequest, user, admin);
            String responseMessage = wasHidden ? "Account unhidden successfully" : "Account banned successfully";

            return ApiResponseUtil.success(convertToResponse, null, responseMessage);

        } catch (Exception e) {
            return ApiResponseUtil.error("Error " + e.getMessage(), HttpStatus.BAD_REQUEST);

        }

    }

    @Transactional
    public ResponseEntity<ApiResponse<Boolean>> HiddengPost(UserPrincipal userPrincipal, UUID postId) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error(
                    "❌ You are not authorized to ban this user.",
                    HttpStatus.UNAUTHORIZED);
        }
        User admin = userPrincipal.getUser();
        var existingPost = postRepository.findById(postId);
        if (existingPost.isPresent()) {
            boolean wasHidden = existingPost.get().isHidden();
            String message;
            if (wasHidden) {
                existingPost.get().setHidden(false);
                message = existingPost.get().getUser().getUsername() + ", your post has been unhidden.";
            } else {
                existingPost.get().setHidden(true);
                message = existingPost.get().getUser().getUsername() + ", your post has been banned.";
            }
            NotificationRequest requestNotificationRequest = NotificationRequest.builder()
                    .type(Notifications.POST_BANNED)
                    .triggerUserId(admin.getId())
                    .receiverId(existingPost.get().getId())
                    .message(message)
                    .build();
            notificationService.saveAndSendNotification(requestNotificationRequest, existingPost.get().getUser(),
                    admin);
            String responseMessage = wasHidden ? "Post unhidden successfully" : "Post banned successfully";
            return ApiResponseUtil.success(existingPost.get().isHidden(), null, responseMessage);
        }
        return ApiResponseUtil.error("You Dont have any Post", HttpStatus.BAD_REQUEST);
    }

    @Transactional
    public ResponseEntity<ApiResponse<String>> deleteUser(@NonNull UUID userId) {
        var user = repouser.findById(userId);
        if (user.isPresent()) {
            user.ifPresent(u -> {
                user.get().setStatus("ban");
                repouser.deleteById(u.getId());
            });
            return ApiResponseUtil.success("delete User", null, "Delete User successful");

        }
        return ApiResponseUtil.error("You Dont have any User", HttpStatus.BAD_REQUEST);
    }

    @Transactional
    public ResponseEntity<ApiResponse<String>> deletePost(UUID postsId) {
        var posts = postRepository.findById(postsId);
        if (posts.isPresent()) {
            postRepository.deleteById(posts.get().getId());
            return ApiResponseUtil.success("delete User", null, "Delete User successful");
        }
        return ApiResponseUtil.error("You Dont have any Posts", HttpStatus.BAD_REQUEST);
    }

    @Transactional
    public ResponseEntity<ApiResponse<UserResponseToAdmin>> changeRole(UserPrincipal userPrincipal, UUID userId) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error(
                    "❌ You are not authorized to ban this user.",
                    HttpStatus.UNAUTHORIZED);
        }
        User admin = userPrincipal.getUser();
        var user = repouser.findById(userId);
        if (user.isPresent()) {
            String message;

            if (admin.isAdmin()) {
                if (admin.getId().equals(user.get().getId())) {
                    message = user.get().getUsername() + ", You Can't change Your Role.";
                } else {
                    if (user.get().getRole() == Roles.ADMIN) {
                        user.get().setRole(Roles.USER);
                        message = user.get().getUsername() + ", your Account has been Changed To User.";

                    } else {
                        user.get().setRole(Roles.ADMIN);
                        message = user.get().getUsername() + ", your Account has been Changed To  Admin.";
                    }
                }

            } else {
                message = "Sorry, you don’t have permission to modify user roles.";
            }

            var userResponse = repouser.save(user.get());
            var convertToResponse = userMapper.ConvertToResponseUserAdmin(userResponse);
            NotificationRequest requestNotificationRequest = NotificationRequest.builder()
                    .type(Notifications.USER_BANNED)
                    .triggerUserId(admin.getId())
                    .receiverId(userId)
                    .message(message)
                    .build();
            notificationService.saveAndSendNotification(requestNotificationRequest, user.get(), admin);
            // String responseMessage = wasHidden ? "Account unhidden successfully" :
            // "Account banned successfully";

            return ApiResponseUtil.success(convertToResponse, null, message);
        }
        return ApiResponseUtil.error("You Dont have any User", HttpStatus.BAD_REQUEST);
    }
}
