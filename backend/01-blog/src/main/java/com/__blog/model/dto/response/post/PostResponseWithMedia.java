package com.__blog.model.dto.response.post;

import java.util.List;

import com.__blog.model.dto.response.MediaResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PostResponseWithMedia extends PostResponse {

    private String htmlContent;
    private String excerpt;
    private List<MediaResponse> medias;

}
