package com.__blog.model.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TagsRequest {

    private Integer id;
    private String tag;
}
