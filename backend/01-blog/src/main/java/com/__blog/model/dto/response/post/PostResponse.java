package com.__blog.model.dto.response.post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.__blog.model.dto.response.TagsResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@SuperBuilder
@AllArgsConstructor
public class PostResponse {

    private UUID id;
    private UUID uuid_user;
    private String title;
    private String content;
    private String firstname;
    private String lastname;
    private String avater_user;
    private LocalDateTime createdAt;
    private String firstImage;
    private List<TagsResponse> tags;
    private boolean isLiked;
    private int likesCount;
    private int commentCount;

    // public PostResponse(Integer id, String title, String content, String htmlContent, String excerpt,
    //         String username,
    //         List<MediaResponse> medias, List<TagsResponse> tags) {
    //     this.id = id;
    //     this.title = title;
    //     this.content = content;
    //     this.htmlContent = htmlContent;
    //     this.excerpt = excerpt;
    //     this.username = username;
    //     this.tags = tags;
    //     this.medias = medias;
    // }
}
