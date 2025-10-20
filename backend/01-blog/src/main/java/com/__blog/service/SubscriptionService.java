package com.__blog.service;

import java.util.List;
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
import com.__blog.repository.PostRepository;
import com.__blog.repository.SubscriptionRepository;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;

import jakarta.transaction.Transactional;

@Service
public class SubscriptionService {

    // Service logic will go here
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    public ApiResponse<List<UserResponse>> getFollowingUser(UUID userid) {
        List<Subscription> user = subscriptionRepository.findBySubscriberUser_Id(userid);
        int countFollowrs = subscriptionRepository.countBySubscribedTo_Id(userid);
        System.err.println("countFollowrs" + countFollowrs);
        // var follow = user.stream()
        //         .map(sub -> userMapper.ConvertResponse(sub.getSubscribedTo()))
        //         .collect(Collectors.toList());

        return returnSameDatApiResponse(user);
    }

    public ApiResponse<List<UserResponse>> getFollowers(UUID userId) {
        List<Subscription> user = subscriptionRepository.findBySubscribedTo_Id(userId);

        return returnSameDatApiResponse(user);
    }

    @Transactional

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

                        boolean isFollowingMe = subscriptionRepository
                                .findBySubscriberUser_IdAndSubscribedTo_Id(user.getId(), userId)
                                .isPresent();
                        int followersCount = subscriptionRepository.countBySubscribedTo_Id(user.getId());
                        int followingCount = subscriptionRepository.countBySubscriberUser_Id(user.getId());
                        int postsCount = postRepository.countByUserId(user.getId());
                        Hibernate.initialize(user.getSkills());
                        UserResponse userResponse = UserResponse.builder()
                                .id(user.getId())
                                .firstname(user.getFirstname())
                                .lastname(user.getLastname())
                                .avatar(user.getAvatarUrl())
                                .about(user.getAbout())
                                .skills(user.getSkills())
                                .username(user.getUsername())
                                .followersCount(followersCount)
                                .followingCount(followingCount)
                                .postsCount(postsCount)
                                .followingMe(isFollowingMe)
                                .build();
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

        // return returnSameDatApiResponse(user);
    }

    private ApiResponse<List<UserResponse>> returnSameDatApiResponse(List<Subscription> user) {
        var follow = user.stream()
                .map(sub -> userMapper.ConvertResponse(sub.getSubscriberUser()))
                .collect(Collectors.toList());

        return ApiResponse.<List<UserResponse>>builder()
                .status(true)
                .data(follow)
                .build();
    }

    public ApiResponse<UserResponse> followUser(UUID userid, UUID targetUserId) {

        var follow = subscriptionRepository.save(entity);
        return null;

    }

    public void unfollowUser(UUID userid, UUID targetUserId) {

    }
}
