package com.__blog.model.dto.response.post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.__blog.model.dto.response.TagsResponse;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@SuperBuilder
// @AllArgsConstructor
public class PostResponse {

    private UUID id;
    private UUID uuid_user;
    private String title;
    private String content;
    private String firstname;
    private String lastname;
    private String avatarUser;
     private String username;
    private LocalDateTime createdAt;
    private String firstImage;
    private List<TagsResponse> tags;
    private boolean isLiked;
    private int likesCount;
    private int commentCount;

    public PostResponse(String avatarUser, int commentCount, String content, LocalDateTime createdAt, String firstImage, String firstname, UUID id, boolean isLiked, String lastname, int likesCount, List<TagsResponse> tags, String title, String username, UUID uuid_user) {
        this.avatarUser = avatarUser;
         this.commentCount = commentCount;
        this.content = content;
        this.createdAt = createdAt;
        this.firstImage = firstImage;
        this.firstname = firstname;
        this.id = id;
        this.isLiked = isLiked;
        this.lastname = lastname;
        this.likesCount = likesCount;
        this.tags = tags;
        this.title = title;
        this.username = username;
        this.uuid_user = uuid_user;
    }

    
}
