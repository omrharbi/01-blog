package com.__blog.service.posts;

import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;

@Service
public class MediaService {

    protected MediaResponse convertToPostResponse(Media media) {
        MediaResponse response = MediaResponse.builder()
                .id(media.getId())
                .filename(media.getFilename())
                .displayOrder(media.getDisplayOrder())
                .filePath(media.getFilePath())
                .fileSize(media.getFileSize())
                .fileType(media.getFileType()).build();
        return response;
    }

    protected Media convertToMediaEntity(MediaRequest mediaDTO, Post postDTO) {
        Media media = new Media();
        media.setFilename(mediaDTO.getFilename());
        media.setFilePath(mediaDTO.getFilePath());
        media.setFileSize(mediaDTO.getFileSize());
        media.setFileType(mediaDTO.getFileType());
        media.setDisplayOrder(mediaDTO.getDisplayOrder());
        media.setPost(postDTO);
        return media;
    }
}
