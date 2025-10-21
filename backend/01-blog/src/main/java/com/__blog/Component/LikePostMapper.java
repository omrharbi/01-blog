package com.__blog.Component;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.response.LikePostResponse;
import com.__blog.model.entity.Like;

@Component
public class LikePostMapper {
    public LikePostResponse convertLikePostResponse(Like like, int countLike, UUID postId) {
        LikePostResponse response = LikePostResponse.builder()
                .countLike(countLike)
                .liked(like.isPostLiked())
                .postId(postId)
                .build();

        return response;
    }
}
