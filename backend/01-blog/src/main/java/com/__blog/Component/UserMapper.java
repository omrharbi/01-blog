package com.__blog.Component;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.User;
import com.__blog.repository.PostRepository;
import com.__blog.repository.SubscriptionRepository;
import com.__blog.repository.UserRepository;

@Component
// @Transactional
public class UserMapper {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public UserResponse ConvertResponse(User user, UUID userId) {
         

            boolean isFollowingMe = subscriptionRepository
                    .findBySubscriberUser_IdAndSubscribedTo_Id(user.getId(), userId)
                    .isPresent();
            int followersCount = subscriptionRepository.countBySubscribedTo_Id(user.getId());
            int followingCount = subscriptionRepository.countBySubscriberUser_Id(user.getId());
            int postsCount = postRepository.countByUserId(user.getId());
            Set<String> skills = userRepository.findSkillsByUserId(userId);
            UserResponse userResponse = UserResponse.builder()
                    .id(user.getId())
                    .firstname(user.getFirstname())
                    .lastname(user.getLastname())
                    .avatar(user.getAvatarUrl())
                    .about(user.getAbout())
                    .username(user.getUsername())
                    .followersCount(followersCount)
                    .followingCount(followingCount)
                    .postsCount(postsCount)
                    .followingMe(isFollowingMe)
                    .skills(skills)
                    .build();
            return userResponse;
        // } catch (Exception e) {
        //     throw new RuntimeException("Error mapping user: " + e.getMessage(), e);
        // }
    }
}
