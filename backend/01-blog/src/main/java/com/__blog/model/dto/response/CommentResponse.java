package com.__blog.model.dto.response;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.__blog.model.entity.Comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CommentResponse {

    private UUID id;
    private String Content;
    private String avatar;
    private String firstname;
    private String lastname;
    private Date createdAt;
    private boolean isLiked;
    private int likesCount;
    private UUID parentCommentId;
    private String username;
    private List<Comment> replies;
}
