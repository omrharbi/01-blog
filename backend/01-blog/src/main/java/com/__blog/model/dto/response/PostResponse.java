package com.__blog.model.dto.response;

import java.util.List;

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

    public PostResponse() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public List<MediaResponse> getMedias() {
        return medias;
    }

    public void setMedias(List<MediaResponse> medias) {
        this.medias = medias;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
