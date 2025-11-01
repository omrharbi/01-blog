package com.__blog.service.posts;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.Component.MediaMapper;
import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.repository.MediaRepository;

@Service
public class MediaService {

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private MediaMapper mediaMapper;

    public void replacePostMedias(Post post, List<MediaRequest> newMediaRequests) {
        deleteAllmedia(post.getId());
        post.getMedias().clear();

        for (MediaRequest mediaRequest : newMediaRequests) {
            Media media = mediaMapper.convertToMediaEntity(mediaRequest);
            media = mediaRepository.save(media);
            // System.out.println("MediaService.replacePostMedias()" + media.getFilename());
            post.addMedia(media);
        }
    }

    public List<Media> deleteAllmedia(UUID postId) {
        List<Media> deletedMedia = mediaRepository.findByPost_Id(postId);

        if (!deletedMedia.isEmpty()) {
            mediaRepository.deleteAll(deletedMedia);
        }
        return deletedMedia;
    }

    public List<Media> findByPostId(UUID postId) {
        // var med=mediaRepository.findAllByPostId(post.getId());
        List<Media> r = mediaRepository.findByPost_Id(postId);
        // for(var l:med){
        //     System.err.println("all media "+l.getFilename());
        // }
        return r;
    }

}
