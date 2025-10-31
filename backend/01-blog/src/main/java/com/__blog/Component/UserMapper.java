package com.__blog.Component;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.__blog.model.dto.request.auth.RegisterRequest;
import com.__blog.model.dto.response.admin.UserResponseToAdmin;
import com.__blog.model.dto.response.user.UserResponse;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Roles;
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
        private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

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
        }

        public UserResponseToAdmin ConvertToResponseUserAdmin(User user) {
                int postsCount = postRepository.countByUserId(user.getId());

                Long count=(long) postsCount;
                UserResponseToAdmin userResponse = UserResponseToAdmin.builder()
                                .status(user.getStatus())
                                .email(user.getEmail())
                                .username(user.getUsername())
                                .postsCount(count)
                                // .createAt(user.getCreate_at())
                                .build();
                return userResponse;
        }

        public User ConvertToEntity(RegisterRequest registerRequest) {
                User user = new User();
                user.setEmail(registerRequest.getEmail());
                user.setPassword(registerRequest.getPassword());
                user.setFirstname(registerRequest.getFirstname());
                user.setLastname(registerRequest.getLastname());
                user.setUsername(registerRequest.getUsername());
                user.setPassword(encoder.encode(registerRequest.getPassword()));
                user.setRole(Roles.USER);
                return user;
        }
}
