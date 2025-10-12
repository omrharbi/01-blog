package com.__blog.model.dto.request;

import java.util.List;

import com.__blog.model.entity.Tags;
 
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostRequest {

    @NotEmpty(message = "Title is mandatory")
    @NotBlank(message = "Title is mandatory")
    private String title;
    private String content;
    private String htmlContent;
    private String excerpt;
    private List<MediaRequest> medias;
    private List<Tags> tags;
}
