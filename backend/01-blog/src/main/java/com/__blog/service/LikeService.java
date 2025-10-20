package com.__blog.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.response.LikePostResponse;
import com.__blog.model.entity.Like;
import com.__blog.repository.LikeRepository;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.util.ApiResponse;

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

    public ApiResponse<LikePostResponse> toggleLikePost(UUID userId, UUID postid) {
        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, postid);
        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            return ApiResponse.<LikePostResponse>builder()
                    .message("Post unliked")
                    .status(false)
                    .build();
        }
        var post = postRepository.findById(postid);
        var user = userRepository.findById(userId);
        if (!post.isPresent() || !user.isPresent()) {
            return ApiResponse.<LikePostResponse>builder()
                    .error("Error to like this post")
                    .status(false)
                    .build();
        }
        Like like = new Like();
        like.setLiked(true);
        like.setPost(post.get());
        like.setUser(user.get());
        likeRepository.save(like);
        return ApiResponse.<LikePostResponse>builder()
                .message("Post liked")
                .status(true)
                .build();
    }
}
