package com.__blog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.__blog.Component.LikePostMapper;
import com.__blog.Component.PostMapper;
import com.__blog.model.dto.response.LikePostResponse;
import com.__blog.model.dto.response.post.PostResponse;
import com.__blog.model.entity.Comment;
import com.__blog.model.entity.Like;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.repository.CommentRespository;
import com.__blog.repository.LikeRepository;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;
import com.__blog.util.ApiResponseUtil;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class LikeService {

    // Service logic will go here
    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private LikePostMapper likePostMapper;
    @Autowired
    private PostMapper postMapper;

    @Autowired
    private CommentRespository commentRespository;

    public ResponseEntity<ApiResponse<LikePostResponse>> toggleLikePost(UserPrincipal users, UUID postId) {
        try {
            if (users == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = users.getId();
            Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, postId);
            Optional<Post> postOpt = postRepository.findById(postId);
            Optional<User> userOpt = userRepository.findById(userId);

            if (postOpt.isEmpty() || userOpt.isEmpty()) {
                return ApiResponseUtil.error("Post or User not found", HttpStatus.NOT_FOUND);
            }

            Post post = postOpt.get();
            User user = userOpt.get();
            LikePostResponse response;

            if (existingLike.isPresent()) {
                likeRepository.delete(existingLike.get());
                response = likePostMapper.convertLikePostOrCommentResponse(existingLike.get(), postRepository.countBylikesPostId(postId), postId);
                return ApiResponseUtil.success(response, null, "Post unliked");
            }

            Like like = new Like();
            like.setLiked(true);
            like.setPost(post);
            like.setUser(user);
            likeRepository.save(like);

            response = likePostMapper.convertLikePostOrCommentResponse(like, postRepository.countBylikesPostId(postId), postId);
            return ApiResponseUtil.success(response, null, "Post liked");

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to toggle like on post: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<LikePostResponse>> toggleLikeComment(UserPrincipal users, UUID commentId) {
        try {
            if (users == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = users.getId();
            Optional<Like> existingLike = likeRepository.findByUserIdAndCommentId(userId, commentId);
            Optional<Comment> commentOpt = commentRespository.findById(commentId);
            Optional<User> userOpt = userRepository.findById(userId);

            if (commentOpt.isEmpty() || userOpt.isEmpty()) {
                return ApiResponseUtil.error("Comment or User not found", HttpStatus.NOT_FOUND);
            }

            Comment comment = commentOpt.get();
            User user = userOpt.get();
            LikePostResponse response;

            if (existingLike.isPresent()) {
                likeRepository.delete(existingLike.get());
                response = likePostMapper.convertLikePostOrCommentResponse(existingLike.get(), commentRespository.countBylikesCommentId(commentId), commentId);
                return ApiResponseUtil.success(response, null, "Comment unliked");
            }

            Like like = new Like();
            like.setLiked(true);
            like.setComment(comment);
            like.setUser(user);
            likeRepository.save(like);

            response = likePostMapper.convertLikePostOrCommentResponse(like, commentRespository.countBylikesCommentId(commentId), commentId);
            return ApiResponseUtil.success(response, null, "Comment liked");

        } catch (Exception e) {
            return ApiResponseUtil.error("Failed to toggle like on comment: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<List<PostResponse>>> getLikedPostsByUser(UserPrincipal users) {
        try {
            if (users == null) {
                return ApiResponseUtil.error("Unauthorized: please login first", HttpStatus.UNAUTHORIZED);
            }
            UUID userId = users.getId();
            // Fetch all posts liked by the user, ordered by creation date descending
            List<Post> postLiked = postRepository.findByLikesUserIdOrderByCreatedAtDesc(userId);
            List<PostResponse> response = new ArrayList<>();

            // Convert each Post entity to PostResponse DTO
            for (Post liked : postLiked) {
                PostResponse postResponse = postMapper.ConvertPostResponse(liked, userId);
                response.add(postResponse);
            }

            // Return success response with the list of liked posts
            return ApiResponseUtil.success(response, null, "Liked Posts");

        } catch (Exception e) {
            // Handle any unexpected errors
            return ApiResponseUtil.error("Failed to get liked posts: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
