package com.__blog.service.posts;

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
    private MediaRepository mediaRepository;

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

    public void replacePostMedias(Post post, List<MediaRequest> newMediaRequests) {
        deleteAllmedia(post);
        post.getMedias().clear();

        for (MediaRequest mediaRequest : newMediaRequests) {
            // System.out.println("MediaService.replacePostMedias()"+mediaRequest.getFilename());
            Media media = convertToMediaEntity(mediaRequest, post);
            media = mediaRepository.save(media);
            post.addMedia(media);
        }
    }

    public void deleteAllmedia(Post post) {
        // var med=mediaRepository.findAllByPostId(post.getId());
          mediaRepository.deleteByPostId(post.getId());
        // for(var l:med){
        //     System.err.println("all media "+l.getFilename());
        // }
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
