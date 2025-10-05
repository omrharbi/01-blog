package com.__blog.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class MediaRequest {

    @NotBlank(message = "Filename is required")
    private String filename;
    @NotBlank(message = "FilePath is required")
    private String filePath;
    @NotBlank(message = "FileType is required")
    private String fileType; // "image" or "video"
    @Positive(message = "FileSize must be positive")
    private Long fileSize;
    @PositiveOrZero(message = "DisplayOrder must be zero or positive")
    private Integer displayOrder;
}
