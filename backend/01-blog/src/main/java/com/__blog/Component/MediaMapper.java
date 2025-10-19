package com.__blog.Component;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
@Component
public class MediaMapper {

    public Media convertToMediaEntity(MediaRequest mediaDTO, Post postDTO) {
        Media media = new Media();
        media.setFilename(mediaDTO.getFilename());
        media.setFilePath(mediaDTO.getFilePath());
        media.setFileSize(mediaDTO.getFileSize());
        media.setFileType(mediaDTO.getFileType());
        media.setDisplayOrder(mediaDTO.getDisplayOrder());
        media.setPost(postDTO);
        return media;
    }

    public MediaResponse convertToPostResponse(Media media) {
        MediaResponse response = MediaResponse.builder()
                .id(media.getId())
                .filename(media.getFilename())
                .displayOrder(media.getDisplayOrder())
                .filePath(media.getFilePath())
                .fileSize(media.getFileSize())
                .fileType(media.getFileType()).build();
        return response;
    }
}
