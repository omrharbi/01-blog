package com.__blog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.CommentMapper;
import com.__blog.model.dto.request.CommentRequest;
import com.__blog.model.dto.request.NotificationRequest;
import com.__blog.model.dto.response.CommentResponse;
import com.__blog.model.entity.Comment;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.model.enums.Notifications;
import com.__blog.repository.CommentRespository;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

@Service
public class CommentService {

    @Autowired
    private CommentRespository commentRespository;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentMapper commentMapper;
    @Autowired
    NotificationService notificationService;

    public ResponseEntity<ApiResponse<CommentResponse>> addComment(UserPrincipal userPrincipal, CommentRequest request) {
        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            Optional<User> userOpt = userRepository.findById(userPrincipal.getId());
            Optional<Post> postOpt = postRepository.findById(request.getPostId());

            if (userOpt.isEmpty() || postOpt.isEmpty()) {
                return ApiResponseUtil.error("Cannot create comment: user or post not found", HttpStatus.NOT_FOUND);
            }

            User user = userOpt.get();
            Post post = postOpt.get();

            // Création du commentaire
            Comment comment = commentMapper.convertToEntityComment(request, post, user);

            // Si commentaire parent (réponse)
            if (request.getParentCommentId() != null) {
                Optional<Comment> parentCommentOpt = commentRespository.findById(request.getParentCommentId());
                parentCommentOpt.ifPresent(comment::setParentComment);
            }

            // Notification au propriétaire du post (si ce n’est pas l’auteur lui-même)
            if (!user.equals(post.getUser())) {
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .type(Notifications.POST_COMMENTED)
                        .triggerUserId(userPrincipal.getId())
                        .receiverId(post.getUser().getId())
                        .message("from " + user.getUsername() + " New comment on your post")
                        .build();

                notificationService.saveAndSendNotification(notificationRequest, post.getUser(), user);
            }

            // Sauvegarde du commentaire
            commentRespository.save(comment);

            CommentResponse response = commentMapper.convertToResponseComment(comment, userPrincipal.getId());

            // Retour succès
            return ApiResponseUtil.success(response, null, "");

        } catch (Exception e) {
            // Gestion globale des erreurs
            return ApiResponseUtil.error("Failed to create comment: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<List<CommentResponse>>> getCommentWithPost(UUID postId, UserPrincipal userPrincipal) {
        try {
            if (userPrincipal == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }

            // Fetch all comments for a given post, ordered by creation date descending
            List<Comment> allCommentsByPost = commentRespository.findByPostIdOrderByCreateAtDesc(postId);

            if (allCommentsByPost == null || allCommentsByPost.isEmpty()) {
                // Return error if no comments found
                return ApiResponseUtil.error("No comments found for this post", HttpStatus.NOT_FOUND);
            }

            // Convert each Comment entity to CommentResponse DTO
            List<CommentResponse> commentResponses = new ArrayList<>();
            for (Comment comment : allCommentsByPost) {
                CommentResponse commentResponse = commentMapper.convertToResponseComment(comment, userPrincipal.getId());
                commentResponses.add(commentResponse);
            }

            // Return success response with the list of comments
            return ApiResponseUtil.success(commentResponses, null, "");

        } catch (Exception e) {
            // Handle any unexpected exceptions
            return ApiResponseUtil.error("Failed to get comments: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<CommentResponse>> editComment(UUID commentId, CommentRequest commentRequest, UserPrincipal user) {
        try {
            if (user == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = user.getId();
            Optional<Comment> commentOpt = commentRespository.findById(commentId);
            Optional<Post> postOpt = postRepository.findById(commentRequest.getPostId());

            if (commentOpt.isEmpty() || postOpt.isEmpty()) {
                return ApiResponseUtil.error("Comment or Post not found", HttpStatus.NOT_FOUND);
            }

            Comment comment = commentOpt.get();
            comment.setContent(commentRequest.getContent());
            commentRespository.save(comment);

            CommentResponse commentResponse = commentMapper.convertToResponseComment(comment, userId);

            return ApiResponseUtil.success(commentResponse, null, ""); // success, 200 OK

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to edit comment: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<Void>> deleteComment(UUID commentId) {
        try {
            Optional<Comment> commentOpt = commentRespository.findById(commentId);

            if (commentOpt.isEmpty()) {
                return ApiResponseUtil.error("Comment not found", HttpStatus.NOT_FOUND);
            }

            commentRespository.delete(commentOpt.get());

            return ApiResponseUtil.success(null, null, "delete comment"); // success, 200 OK, no data needed

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to delete comment: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
