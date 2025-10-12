package com.__blog.model.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Getter
@NoArgsConstructor
@Builder
public class PostResponse {

    private Integer id;
    private String title;
    private String content;
    private String htmlContent;
    private String excerpt;
    private List<MediaResponse> medias;

    public PostResponse(Integer id, String title, String content, String htmlContent, String excerpt, List<MediaResponse> medias) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.htmlContent = htmlContent;
        this.excerpt = excerpt;
        this.medias = medias;
    }

     
}
