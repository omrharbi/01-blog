package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
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
@Transactional
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

    public ResponseEntity<ApiResponse<PostResponse>> createPost(PostRequest postRequest, UserPrincipal userPrincipal) {
        try {

            User user = userPrincipal.getUser();
            Post post = postMapper.convertToEntity(postRequest);
            post.setUser(user);
            if ((postRequest.getMedias() != null && !postRequest.getMedias().isEmpty())) {
                for (var medai : postRequest.getMedias()) {
                    var mediaDTO = mediaMapper.convertToMediaEntity(medai, post);
                    post.addMedia(mediaDTO);
                }

            }

            if ((postRequest.getTags() != null && !postRequest.getTags().isEmpty())) {
                postRequest.getTags().forEach(tagName -> {
                    var tag = postMapper.convertToTagsEntity(tagName);
                    post.addTag(tag);
                });
            }
            var followers = subscriptionRepository.findBySubscribedTo_Id(user.getId());
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
            Post savedPost = postRepository.save(post);
            PostResponse postResponse = postMapper.ConvertPostResponse(savedPost, user.getId());
            return ApiResponseUtil.success(postResponse, null, "");

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to create post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<PostResponse>> editPost(PostRequest postRequest, UUID id, UUID userId) {
        try {

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
                        Media media = mediaMapper.convertToMediaEntity(tagRequest, existingPost);
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

    public ResponseEntity<ApiResponse<PostResponseWithMedia>> getPostById(UUID postId, UUID userId) {
        Optional<Post> postOptional = postRepository.findByIdWithMedias(postId);

        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            PostResponseWithMedia postResponse = postMapper.convertToPostWithMediaResponse(post, userId);
            // Retour succès
            return ApiResponseUtil.success(postResponse, null, ""); // token null si pas nécessaire
        } else {
            // Retour erreur avec code 404
            return ApiResponseUtil.error("Post with this ID not found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<ApiResponse<List<PostResponse>>> getPostsFromUserId(String username) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                return ApiResponseUtil.error("User not found", HttpStatus.NOT_FOUND);
            }

            User user = userOpt.get();
            Optional<List<Post>> postsOpt = postRepository.findByUserId(user.getId());

            if (postsOpt.isEmpty() || postsOpt.get().isEmpty()) {
                return ApiResponseUtil.error("No posts found for this user", HttpStatus.NOT_FOUND);
            }

            List<PostResponse> postResponses = new ArrayList<>();
            for (Post post : postsOpt.get()) {
                Hibernate.initialize(post.getTags()); // Assure que les tags sont chargés
                PostResponse postDTO = postMapper.ConvertPostResponse(post, user.getId());
                postResponses.add(postDTO);
            }

            // Renvoie succès avec les données
            return ApiResponseUtil.success(postResponses, null, "");

        } catch (Exception e) {
            // Gestion globale des erreurs
            return ApiResponseUtil.error("Failed to get user posts: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<List<PostResponse>>> getPosts(UUID userId) {
        List<Post> posts = postRepository.findAllWithMedias();
        List<PostResponse> allPosts = new ArrayList<>();
        for (Post p : posts) {
            PostResponse convert = postMapper.convertToPostWithMediaResponse(p, userId);
            allPosts.add(convert);
        }
        return ApiResponseUtil.success(allPosts, null, "");
    }

    public UUID deletePost(UUID postId) {
        var post = postRepository.findById(postId);
        if (post.isPresent()) {
            postRepository.deleteById(postId);
        }
        return post.get().getId();
    }
}
