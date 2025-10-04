package com.__blog.model.dto.request;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PostRequest {

    private String title;
    private String htmlContent;
    private String excerpt;
    private List<MediaRequest> medias;
}
