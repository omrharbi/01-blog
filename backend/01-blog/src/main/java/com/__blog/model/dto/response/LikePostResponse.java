package com.__blog.model.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class LikePostResponse {

    private boolean liked;
    private UUID postIdOrComment;
    private int countLike;
    // private UUID post
}
