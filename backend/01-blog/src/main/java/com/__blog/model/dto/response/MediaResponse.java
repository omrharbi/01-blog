package com.__blog.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class MediaResponse {

    private int Id;
    private String filename;
    private String filePath;
    private String fileType;
    private Long fileSize;
    private int displayOrder;
}
