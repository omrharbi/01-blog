package com.__blog.service.posts;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.HibernateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.MediaMapper;
import com.__blog.Component.PostMapper;
import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.request.TagsRequest;
import com.__blog.model.dto.response.post.PostResponse;
import com.__blog.model.dto.response.post.PostResponseWithMedia;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.Subscription;
import com.__blog.model.entity.Tags;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Notifications;
import com.__blog.repository.PostRepository;
import com.__blog.repository.SubscriptionRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.service.NotificationService;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

import jakarta.transaction.Transactional;

@Service

public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostMapper postMapper;
    @Autowired
    private MediaMapper mediaMapper;
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Transactional
    public ResponseEntity<ApiResponse<PostResponse>> createPost(PostRequest postRequest, UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ApiResponseUtil.error(
                    "❌ Failed to send notification to user: ",
                    HttpStatus.UNAUTHORIZED);
        }
        User user = userPrincipal.getUser();

        Post post = postMapper.convertToEntity(postRequest);
        post.setUser(user);
        if ((postRequest.getMedias() != null && !postRequest.getMedias().isEmpty())) {
            for (var medai : postRequest.getMedias()) {
                var mediaDTO = mediaMapper.convertToMediaEntity(medai);
                post.addMedia(mediaDTO);
            }
        }

        if ((postRequest.getTags() != null && !postRequest.getTags().isEmpty())) {
            postRequest.getTags().forEach(tagName -> {
                var tag = postMapper.convertToTagsEntity(tagName);
                post.addTag(tag);
            });
        }
        Pageable unpaged = Pageable.unpaged();
        Page<Subscription> followersPage = subscriptionRepository.findBySubscribedTo_Id(user.getId(), unpaged);
        List<Subscription> followers = followersPage.getContent();
        Post savedPost = postRepository.save(post);
        for (var follow : followers) {
            User receiver = follow.getSubscriberUser();
            User triggerUser = user;
            NotificationRequest requestNotificationRequest = NotificationRequest.builder()
                    .type(Notifications.NEW_POST)
                    .triggerUserId(triggerUser.getId())
                    .receiverId(receiver.getId())
                    .message(triggerUser.getUsername() + " created a new post.")
                    .build();
            notificationService.saveAndSendNotification(requestNotificationRequest, receiver, triggerUser);
        }
        PostResponse postResponse = postMapper.ConvertPostResponse(savedPost, user.getId());

        // ✅ RETURN THE ACTUAL RESPONSE
        return ApiResponseUtil.success(postResponse, null, " created a new post");
    }

    @Transactional
    public ResponseEntity<ApiResponse<PostResponse>> editPost(PostRequest postRequest, String uuid,
            UserPrincipal user) {
        try {
            if (!ApiResponseUtil.isValidUUID(uuid)) {
                return ApiResponseUtil.error("Post with this ID not found", HttpStatus.NOT_FOUND);
            }
            UUID id = UUID.fromString(uuid);

            if (user == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = user.getId();
            Optional<Post> post = postRepository.findById(id);
            if (post.isPresent()) {
                Post existingPost = post.get();
                existingPost.setTitle(postRequest.getTitle());
                existingPost.setContent(postRequest.getContent());
                existingPost.setHtmlContent(postRequest.getHtmlContent());
                existingPost.setExcerpt(postRequest.getExcerpt());

                if (postRequest.getMedias() != null) {
                    existingPost.getMedias().clear();
                    for (MediaRequest tagRequest : postRequest.getMedias()) {
                        Media media = mediaMapper.convertToMediaEntity(tagRequest);
                        existingPost.addMedia(media);
                    }
                }

                if (postRequest.getTags() != null) {
                    existingPost.getTags().clear();
                    for (TagsRequest tagRequest : postRequest.getTags()) {
                        Tags tag = postMapper.convertToTagsEntity(tagRequest);
                        existingPost.addTag(tag);
                    }
                }

                Post savedPost = postRepository.save(existingPost);

                PostResponse response = postMapper.ConvertPostResponse(savedPost, userId);
                return ApiResponseUtil.success(response, null, "");

            }
            return ApiResponseUtil.error("Failed to create post: ", HttpStatus.INTERNAL_SERVER_ERROR);

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to create post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @Transactional
    public ResponseEntity<ApiResponse<PostResponseWithMedia>> getPostById(String uuid, UUID userId) {

        if (!ApiResponseUtil.isValidUUID(uuid)) {
            return ApiResponseUtil.error("Post with this ID not found", HttpStatus.NOT_FOUND);
        }
        UUID postId = UUID.fromString(uuid);
        if (postId.equals(new UUID(0, 0))) {
            return ApiResponseUtil.error("Invalid post ID " + postId, HttpStatus.NOT_FOUND);
        }

        Optional<Post> postOptional = postRepository.findByIdWithMedias(postId);

        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (post.isHidden()) {
                return ApiResponseUtil.error("this Post Is Hidan From Admin ", HttpStatus.BAD_REQUEST);
            }

            PostResponseWithMedia postResponse = postMapper.convertToPostWithMediaResponse(post, userId);
            return ApiResponseUtil.success(postResponse, null, ""); // token null si pas nécessaire
        } else {
            return ApiResponseUtil.error("Post with this ID not found", HttpStatus.NOT_FOUND);
        }

    }

    @Transactional
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostsFromUserUsername(String username,
            LocalDateTime snapshotTime, int page,
            int size) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
            }
            LocalDateTime effectiveSnapshotTime = snapshotTime != null
                    ? snapshotTime
                    : LocalDateTime.now();
            Pageable pageable = PageRequest.of(page, size);
            User user = userOpt.get();
            Page<Post> postsOpt = postRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), effectiveSnapshotTime,
                    pageable);

            Page<PostResponse> postResponses = postsOpt
                    .map(post -> postMapper.ConvertPostResponse(post, user.getId()));

            return ApiResponseUtil.success(postResponses, null, "");

        } catch (HibernateException e) {
            // Gestion globale des erreurs
            return ApiResponseUtil.error("Failed to get user posts: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPosts(UUID userId, LocalDateTime snapshotTime, int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        LocalDateTime effectiveSnapshotTime = snapshotTime != null ? snapshotTime : LocalDateTime.now();
        Page<PostResponse> findPostResponses = postRepository.findAllPostsWithFirstMedia(effectiveSnapshotTime,
                pageable);
        if (findPostResponses.isEmpty()) {
            return ApiResponseUtil.success(findPostResponses, null, "");
        }
        var result = postMapper.ConvertPostResponse(findPostResponses, userId);
        return ApiResponseUtil.success(result, null, "");
    }

    public ResponseEntity<ApiResponse<Page<PostResponse>>> getAllPostsFromFollowedUsers(UUID userId,
            LocalDateTime snapshotTime,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size);
        LocalDateTime effectiveSnapshotTime = snapshotTime != null ? snapshotTime : LocalDateTime.now();
        Page<PostResponse> findPostResponses = postRepository.findPostsFromFollowedUsers(userId, effectiveSnapshotTime,
                pageable);
        if (findPostResponses.isEmpty()) {
            return ApiResponseUtil.success(findPostResponses, null, "");
        }
        var result = postMapper.ConvertPostResponse(findPostResponses, userId);
        return ApiResponseUtil.success(result, null, "");
    }

    @Transactional
    public ResponseEntity<ApiResponse<String>> deletePost(UserPrincipal userPrincipal, UUID postId) {
        // var user=UserPrincipal.
        if (userPrincipal == null) {
            return ApiResponseUtil.error(
                    "❌ Failed to send notification to user: ",
                    HttpStatus.UNAUTHORIZED);
        }
        User user = userPrincipal.getUser();

        var post = postRepository.findById(postId);

        if (post.isEmpty()) {
            return ApiResponseUtil.error("Post not found with ID: " + postId, HttpStatus.NOT_FOUND);
        }
        if (!post.get().getUser().getId().equals(user.getId())) {
            return ApiResponseUtil.error("You are not allowed to delete this post.", HttpStatus.FORBIDDEN);
        }

        postRepository.deleteById(postId);
        return ApiResponseUtil.success("Post deleted successfully", null, null);
    }

}
