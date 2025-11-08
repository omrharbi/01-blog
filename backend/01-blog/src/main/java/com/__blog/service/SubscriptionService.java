package com.__blog.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.Subscription;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Notifications;
import com.__blog.repository.SubscriptionRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private NotificationService notificationService;

    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsersIFollow(UUID userId, int page, int size) {
        try {
            // Fetch subscriptions where the user is the subscriber
            Pageable pageable = PageRequest.of(page, size);
            Page<Subscription> userSubscriptions = subscriptionRepository.findBySubscriberUser_Id(userId, pageable);

            // Extract the users the current user follows
            List<User> followUsers = userSubscriptions.stream()
                    .map(Subscription::getSubscribedTo)
                    .collect(Collectors.toList());

            // Convert each User entity to UserResponse DTO
            List<UserResponse> userResponses = followUsers.stream().map(user -> {
                Hibernate.initialize(user.getSkills()); // ensure skills are loaded
                return userMapper.ConvertResponse(user, userId);
            }).collect(Collectors.toList());
            Page<UserResponse> responses1 = new PageImpl<>(
                    userResponses,
                    pageable,
                    userResponses.size());
            // Return success with a message
            return ApiResponseUtil.success(responses1, null, "Users you follow retrieved successfully");

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to fetch users you follow: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<Page<UserResponse>>> getFollowers(UserPrincipal userPrincipal, int page,
            int size) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
        }
        UUID userId = userPrincipal.getId();
        if (!userRepository.existsById(userId)) {
            return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
        }
        Pageable pageable = PageRequest.of(page, size);

        Page<Subscription> userSubscriptions = subscriptionRepository.findBySubscribedTo_Id(userId, pageable);

        // Use your existing helper method to convert subscriptions to UserResponse
        Page<UserResponse> userResponses = returnSameDatApiResponse(userSubscriptions, userId, pageable).getData();

        // Return success response with message
        return ApiResponseUtil.success(userResponses, null, "Followers retrieved successfully");
    }

    public ResponseEntity<ApiResponse<Page<UserResponse>>> getUsersNotFollowing(UserPrincipal userPrincipal, int page,
            int size) {
        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = userPrincipal.getId();
            if (!userRepository.existsById(userId)) {
                return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
            }
            // users I Follow
            Pageable pageable = PageRequest.of(page, size);
 
            Page<User> usersNotFollowed = userRepository.findUsersNotFollowedBy(userId, pageable);
            Page<UserResponse> userResponses = usersNotFollowed.map(user -> {
                Hibernate.initialize(user.getSkills());
                return userMapper.ConvertResponse(user, userId);
            });

            return ApiResponseUtil.success(userResponses, null, "Users you don't follow retrieved successfully");
        } catch (Exception e) {
            return ApiResponseUtil.error("Error retrieving users you don't follow: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public ResponseEntity<ApiResponse<UserResponse>> followUser(UserPrincipal userPrincipal, UUID targetUserId) {

        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = userPrincipal.getId();
            Optional<User> subscriber = userRepository.findById(userId);
            if (!subscriber.isPresent()) {
                return ApiResponseUtil.error("Subscriber user not found", HttpStatus.NOT_FOUND);
            }

            Optional<User> targetUserOpt = userRepository.findById(targetUserId);
            if (!targetUserOpt.isPresent()) {
                return ApiResponseUtil.error("Target user not found", HttpStatus.NOT_FOUND);
            }
            if (userId.equals(targetUserId)) {
                return ApiResponseUtil.error("You cannot follow yourself", HttpStatus.BAD_REQUEST);
            }

            boolean isAlreadyFollow = subscriptionRepository.existsBySubscriberUser_IdAndSubscribedTo_Id(userId,
                    targetUserId);
            if (isAlreadyFollow) {
                return ApiResponseUtil.error("You are already following this user", HttpStatus.CONFLICT);
            }
            Subscription subscription = new Subscription();

            subscription.setSubscribedTo(targetUserOpt.get());
            subscription.setSubscriberUser(subscriber.get());

            subscriptionRepository.save(subscription);
            NotificationRequest request = NotificationRequest.builder()
                    .type(Notifications.FOLLOW)
                    .triggerUserId(userId)
                    .receiverId(targetUserOpt.get().getId())
                    .message(subscriber.get().getUsername() + " started following you.")
                    .build();
            notificationService.saveAndSendNotification(request, targetUserOpt.get(), subscriber.get());
            return ApiResponseUtil.success(null, null, "Successfully followed " + targetUserOpt.get().getUsername());
        } catch (Exception e) {

            return ApiResponseUtil.error("Error following user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<UserResponse>> unfollowUser(UserPrincipal userPrincipal, UUID targetUserId) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
        }
        UUID userId = userPrincipal.getId();
        Optional<User> subscriber = userRepository.findById(userId);
        if (!subscriber.isPresent()) {
            return ApiResponseUtil.error("Subscriber user not found", HttpStatus.NOT_FOUND);
        }

        Optional<User> targetUserOpt = userRepository.findById(targetUserId);
        if (!targetUserOpt.isPresent()) {
            return ApiResponseUtil.error("Target user not found", HttpStatus.NOT_FOUND);
        }
        if (userId.equals(targetUserId)) {
            return ApiResponseUtil.error("You cannot unfollow yourself", HttpStatus.BAD_REQUEST);
        }
        var subscription = subscriptionRepository.findBySubscriberUser_IdAndSubscribedTo_Id(userId, targetUserId);
        if (subscription.isEmpty()) {
            return ApiResponseUtil.error("You are not following this user", HttpStatus.CONFLICT);
        }

        subscriptionRepository.delete(subscription.get());
        return ApiResponseUtil.success(null, null, "Successfully unfollowed " + targetUserOpt.get().getUsername());
    }

    private ApiResponse<Page<UserResponse>> returnSameDatApiResponse(Page<Subscription> user, UUID userId,
            Pageable pageable) {

        var follow = user.stream()
                .map(sub -> userMapper.ConvertResponse(sub.getSubscriberUser(), userId))
                .collect(Collectors.toList());
        Page<UserResponse> responses1 = new PageImpl<>(
                follow,
                pageable,
                follow.size());
        return ApiResponse.<Page<UserResponse>>builder()
                .status(true)
                .data(responses1)
                .build();
    }

}
