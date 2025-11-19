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

    public PostResponse(UUID id, UUID uuid_user, String title, String content,
            LocalDateTime createdAt, String firstImage,
            String firstname, String lastname, String username) {
        this.id = id;
        this.uuid_user = uuid_user;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.firstImage = firstImage;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
    }

    public PostResponse(UUID id, UUID uuid_user, String title, String content,
            LocalDateTime createdAt,
            String firstname, String lastname, String username) {
        this.id = id;
        this.uuid_user = uuid_user;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
    }
}
