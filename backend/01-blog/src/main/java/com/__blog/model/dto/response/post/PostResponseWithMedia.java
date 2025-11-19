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
public class PostResponseWithMedia extends PostResponse {

    private String htmlContent;
    private String excerpt;

    public PostResponseWithMedia(UUID id, UUID uuid_user, String title, String content,
                                 LocalDateTime createdAt, String firstImage,
                                 String firstname, String lastname, String username,
                                 String htmlContent, String excerpt) {
        super(id, uuid_user, title, content, createdAt, firstImage, firstname, lastname, username);
        this.htmlContent = htmlContent;
        this.excerpt = excerpt;
    }

    public PostResponseWithMedia(UUID id, UUID uuid_user, String title, String content,
                                 LocalDateTime createdAt,
                                 String firstname, String lastname, String username,
                                 String htmlContent, String excerpt) {
        super(id, uuid_user, title, content, createdAt,  firstname, lastname, username);
        this.htmlContent = htmlContent;
        this.excerpt = excerpt;
    }

    public void setMedias(List<MediaResponse> medias) {
        super.getMedias().addAll(medias);
    }

    public void setTags(List<TagsResponse> tags) {
        super.getTags().addAll(tags);
    }
}
