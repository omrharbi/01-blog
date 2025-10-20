package com.__blog.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.Subscription;
import com.__blog.model.entity.User;
import com.__blog.repository.SubscriptionRepository;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;

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

    public ApiResponse<List<UserResponse>> getUsersIFollow(UUID userid) {
        List<Subscription> userSubscriptions = subscriptionRepository.findBySubscriberUser_Id(userid);
        List<User> followUsers = userSubscriptions.stream()
                .map(Subscription::getSubscribedTo).collect(Collectors.toList());
        List<UserResponse> userResponses = followUsers.stream().map(user -> {
            Hibernate.initialize(user.getSkills());

            return userMapper.ConvertResponse(user, userid);
        }).collect(Collectors.toList());
        return ApiResponse.<List<UserResponse>>builder()
                .data(userResponses)
                .build();
    }

    public ApiResponse<List<UserResponse>> getFollowers(UUID userId) {
        if (!userRepository.existsById(userId)) {
            return ApiResponse.<List<UserResponse>>builder()
                    .status(false)
                    .message("User not found")
                    .build();
        }
        List<Subscription> user = subscriptionRepository.findBySubscribedTo_Id(userId);
        return returnSameDatApiResponse(user, userId);
    }

    public ApiResponse<List<UserResponse>> getUsersNotFollowing(UUID userId) {
        try {
            if (!userRepository.existsById(userId)) {
                return ApiResponse.<List<UserResponse>>builder()
                        .status(false)
                        .message("User not found")
                        .build();
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

            return ApiResponse.<List<UserResponse>>builder()
                    .status(true)
                    .data(responses)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<List<UserResponse>>builder()
                    .status(false)
                    .error("Error retrieving users you don't follow: " + e.getMessage()).build();
        }

    }

    public ApiResponse<UserResponse> followUser(UUID userid, UUID targetUserId) {

        try {

            Optional<User> subscriber = userRepository.findById(userid);
            if (!subscriber.isPresent()) {
                return ApiResponse.< UserResponse>builder()
                        .status(false)
                        .error("Subscriber user not found")
                        .build();
            }

            Optional<User> subscribedTo = userRepository.findById(targetUserId);
            if (!subscribedTo.isPresent()) {
                return ApiResponse.< UserResponse>builder()
                        .status(false)
                        .error("Target user not found")
                        .build();
            }
            if (userid.equals(targetUserId)) {
                return ApiResponse.< UserResponse>builder()
                        .status(false)
                        .error("You cannot follow yourself")
                        .build();
            }

            var isAlreadyFollow = subscriptionRepository.existsBySubscriberUser_IdAndSubscribedTo_Id(userid, targetUserId);
            if (isAlreadyFollow) {
                return ApiResponse.< UserResponse>builder()
                        .status(false)
                        .error("You are already following this user")
                        .build();
            }
            Subscription subscription = new Subscription();

            subscription.setSubscribedTo(subscribedTo.get());
            subscription.setSubscriberUser(subscriber.get());

            subscriptionRepository.save(subscription);

            return ApiResponse.< UserResponse>builder()
                    .status(true)
                    .message("Successfully followed " + subscribedTo.get().getUsername())
                    // .data(subscription)
                    .build();
        } catch (Exception e) {

            return ApiResponse.< UserResponse>builder()
                    .status(true)
                    .error("Error  " + e)
                    // .data(subscription)
                    .build();
        }
    }

    public void unfollowUser(UUID userid, UUID targetUserId) {

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
