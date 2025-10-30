package com.__blog.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
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

    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersIFollow(UUID userId) {
        try {
            // Fetch subscriptions where the user is the subscriber
            List<Subscription> userSubscriptions = subscriptionRepository.findBySubscriberUser_Id(userId);

            // Extract the users the current user follows
            List<User> followUsers = userSubscriptions.stream()
                    .map(Subscription::getSubscribedTo)
                    .collect(Collectors.toList());

            // Convert each User entity to UserResponse DTO
            List<UserResponse> userResponses = followUsers.stream().map(user -> {
                Hibernate.initialize(user.getSkills()); // ensure skills are loaded
                return userMapper.ConvertResponse(user, userId);
            }).collect(Collectors.toList());

            // Return success with a message
            return ApiResponseUtil.success(userResponses, null, "Users you follow retrieved successfully");

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to fetch users you follow: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<List<UserResponse>>> getFollowers(UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
        }
        UUID userId = userPrincipal.getId();
        if (!userRepository.existsById(userId)) {
            return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
        }

        List<Subscription> userSubscriptions = subscriptionRepository.findBySubscribedTo_Id(userId);

        // Use your existing helper method to convert subscriptions to UserResponse
        List<UserResponse> userResponses = returnSameDatApiResponse(userSubscriptions, userId).getData();

        // Return success response with message
        return ApiResponseUtil.success(userResponses, null, "Followers retrieved successfully");
    }

    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersNotFollowing(UserPrincipal userPrincipal) {
        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = userPrincipal.getId();
            if (!userRepository.existsById(userId)) {
                return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
            }
            // users I Follow 
            List<User> allUser = userRepository.findAll();
            List<Subscription> userSubscriptions = subscriptionRepository.findBySubscriberUser_Id(userId);
            Set<UUID> userIFollowIds = userSubscriptions.stream().map(sub -> sub.getSubscribedTo().getId())
                    .collect(Collectors.toSet());

            List<User> usersINotFollow = allUser.stream()
                    .filter(user -> !user.getId().equals(userId))
                    .filter(user -> !userIFollowIds.contains(user.getId()))
                    .collect(Collectors.toList());
            List<UserResponse> responses = usersINotFollow.stream()
                    .map(user -> {
                        Hibernate.initialize(user.getSkills());

                        UserResponse userResponse = userMapper.ConvertResponse(user, userId);
                        return userResponse;
                    }).collect(Collectors.toList());

            return ApiResponseUtil.success(responses, null, "Users you don't follow retrieved successfully");
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

            boolean isAlreadyFollow = subscriptionRepository.existsBySubscriberUser_IdAndSubscribedTo_Id(userId, targetUserId);
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

    private ApiResponse<List<UserResponse>> returnSameDatApiResponse(List<Subscription> user, UUID userId) {

        var follow = user.stream()
                .map(sub -> userMapper.ConvertResponse(sub.getSubscriberUser(), userId))
                .collect(Collectors.toList());

        return ApiResponse.<List<UserResponse>>builder()
                .status(true)
                .data(follow)
                .build();
    }

}
