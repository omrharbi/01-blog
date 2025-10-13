package com.__blog.model.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class PostResponse {

    private Integer id;
    private String title;
    private String content;
    private String htmlContent;
    private String excerpt;
    private String firstname;
    private String lastname;
    private LocalDateTime createdAt;
    private List<MediaResponse> medias;
    private List<TagsResponse> tags;

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
