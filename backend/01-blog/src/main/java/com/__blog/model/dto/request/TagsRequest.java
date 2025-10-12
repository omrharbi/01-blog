package com.__blog.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TagsRequest {

    @NotBlank(message = "Tags is required")
    private String tag;
}
