package com.__blog.model.dto.response.post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.__blog.model.dto.response.MediaResponse;
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
    private List<MediaResponse> medias;
    private boolean isLiked;
    private int likesCount;
    private int commentCount;

    public PostResponse(
            String content,
            LocalDateTime createdAt,
            UUID id,
            String title,
            UUID uuid_user,
            String firstMediaUrl
    ) {
        this.content = content;
        this.createdAt = createdAt;
        this.id = id;
        this.title = title;
        this.uuid_user = uuid_user;
        this.firstImage = firstMediaUrl;
    }

}
