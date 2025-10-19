package com.__blog.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.Component.UserMapper;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.Subscription;
import com.__blog.repository.SubscriptionRepository;

@Service
public class SubscriptionService {

    // Service logic will go here
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserMapper userMapper;

    public List<UserResponse> getFollowingUser(UUID userid) {
        List<Subscription> user = subscriptionRepository.findBySubscriberUser_Id(userid);
        var follow = user.stream()
                .map(sub -> userMapper.ConvertResponse(sub.getSubscribedTo()))
                .collect(Collectors.toList());

        return follow;
    }

    public List<UserResponse> getFollowers(UUID userId) {
        List<Subscription> user = subscriptionRepository.findBySubscribedTo_Id(userId);
        var follow = user.stream()
                .map(sub -> userMapper.ConvertResponse(sub.getSubscriberUser()))
                .collect(Collectors.toList());

        return follow;
    }

}
