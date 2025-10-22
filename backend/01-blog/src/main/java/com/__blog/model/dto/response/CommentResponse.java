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

    private String Content;
    private String avatar;
    private String firstname;
    private String lastname;
    private Date createdAt;

    private UUID parentCommentId; // ⭐ لـ replies
    private List<Comment> replies;

    // public Date getCreatedAt() {
    //     return createdAt;
    // }
    // public String getContent() {
    //     return Content;
    // }
    // public String getAvatar() {
    //     return avatar;
    // }
    // public String getFirstname() {
    //     return firstname;
    // }
    // public String getLastname() {
    //     return lastname;
    // }
}
