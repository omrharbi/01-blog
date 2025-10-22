package com.__blog.Component;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.response.LikePostResponse;
import com.__blog.model.entity.Like;

@Component
public class LikePostMapper {
    public LikePostResponse convertLikePostOrCommentResponse(Like like, int countLike, UUID postId) {
        LikePostResponse response = LikePostResponse.builder()
                .countLike(countLike)
                .liked(like.isPostLiked())
                .postIdOrComment(postId)
                .build();

        return response;
    }

}
