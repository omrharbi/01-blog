package com.__blog.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MediaResponse {

    private String filename;
    private String filePath;
    private String fileType;
    private Long  fileSize;
    private int displayOrder;
}
