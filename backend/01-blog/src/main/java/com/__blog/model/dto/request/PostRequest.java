package com.__blog.model.dto.request;

import java.util.List;

import lombok.NoArgsConstructor;
 
@NoArgsConstructor
public class PostRequest {

    // @NotEmpty(message = "Title is mandatory")
    // @NotBlank(message = "Title is mandatory")
    private String title;
    private String content;
    private String htmlContent;
    private String excerpt;
    private List<MediaRequest> medias;
    private List<TagsRequest> tags;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getHtmlContent() {
        return htmlContent;
    }

    public void setHtmlContent(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }

    public List<MediaRequest> getMedias() {
        return medias;
    }

    public void setMedias(List<MediaRequest> medias) {
        this.medias = medias;
    }

    public List<TagsRequest> getTags() {
        return tags;
    }

    public void setTags(List<TagsRequest> tags) {
        this.tags = tags;
    }
}
