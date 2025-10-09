package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.repository.MediaRepository;
import com.__blog.util.ApiResponse;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediRepository;

    protected ApiResponse< List<MediaResponse>> getAllMediaFromIdPost(Integer idPost) {
        if (idPost == null || idPost <= 0) {
            return ApiResponse.<List<MediaResponse>>builder().status(false).message("this id is uncoret").build();
        }
        try {
            List< Media> medias = mediRepository.findByPost_Id(idPost);
            List<MediaResponse> convertDTO = new ArrayList<>();
            for (var m : medias) {
                MediaResponse response = convertToPostResponse(m);
                convertDTO.add(response);
            }
            return ApiResponse.<List<MediaResponse>>builder().status(true).data(convertDTO).build();
        } catch (Exception e) {
            return ApiResponse.<List<MediaResponse>>builder().status(false).message("Error fetching media for post ID: " + idPost+" "+ e).build();
        }

    }

    protected MediaResponse convertToPostResponse(Media media) {
        MediaResponse response = new MediaResponse();
        response.setFilename(media.getFilename());
        response.setDisplayOrder(media.getDisplayOrder());
        response.setFilePath(media.getFilePath());
        response.setFileSize(media.getFileSize());
        response.setFileType(media.getFileType());
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
