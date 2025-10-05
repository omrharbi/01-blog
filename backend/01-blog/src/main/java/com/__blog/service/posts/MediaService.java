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

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediRepository;

    protected List<MediaResponse> getAllMediaFromIdPost(Integer idPost) {
        // System.err.println("***************************************************");
        List< Media> medias = mediRepository.findByPost_Id(idPost);
        // System.out.println("MediaService.getAllMediaFromIdPost()"+medias);
        List<MediaResponse> convertDTO = new ArrayList<>();
        for (var m : medias) {
            MediaResponse response = convertToPostResponse(m);
            convertDTO.add(response);
        }
        return convertDTO;
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
