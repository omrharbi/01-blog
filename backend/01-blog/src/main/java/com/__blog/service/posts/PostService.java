package com.__blog.service.posts;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.repository.MediaRepository;
import com.__blog.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private MediaRepository mediaRepository;

    public Post createPost(PostRequest postRequest, User user) {
        Post post = convertToEntity(postRequest, user);
        Post post_save = postRepository.save(post);
        if (postRequest.getMedias() != null) {
            List<Media> medias = postRequest.getMedias().stream().map(mediaDTO -> convertToEntity(mediaDTO, post_save))
                    .collect(Collectors.toList());

            mediaRepository.saveAll(medias);
        }
        return post_save;
    }

    private Post convertToEntity(PostRequest postDTO, User user) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setHtmlContent(postDTO.getHtmlContent());
        post.setExcerpt(postDTO.getExcerpt());
        post.setUser_posts(user);
        return post;
    }

    private Media convertToEntity(MediaRequest mediaDTO, Post postDTO) {
        Media media = new Media();
        media.setFilename(mediaDTO.getFilename());
        media.setFilePath(mediaDTO.getFilePath());
        media.setFileSize(mediaDTO.getFileSize());
        media.setFileType(mediaDTO.getFileType());
        media.setDisplayOrder(mediaDTO.getDisplayOrder());
        media.setPost_medias(postDTO);
        return media;
    }
}
