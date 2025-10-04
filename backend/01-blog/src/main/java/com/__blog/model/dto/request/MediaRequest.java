package com.__blog.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class MediaRequest {

    private String filename;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private Integer displayOrder;
}
