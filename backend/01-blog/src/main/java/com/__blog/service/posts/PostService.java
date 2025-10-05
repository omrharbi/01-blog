package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.dto.response.PostResponse;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.repository.MediaRepository;
import com.__blog.repository.PostRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private MediaRepository mediaRepository;
    @Autowired
    private MediaService mediaService;

    @Transactional
    public ApiResponse<PostResponse> createPost(PostRequest postRequest, UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        Post post = convertToEntity(postRequest, user);
        Post post_save = postRepository.save(post);
        PostResponse response = getLastPostCreate(post_save.getId());
        if (postRequest.getMedias() != null && !postRequest.getMedias().isEmpty()) {
            List<Media> medias = new ArrayList<>();
            for (var medai : postRequest.getMedias()) {
                var mediaDTO = mediaService.convertToMediaEntity(medai, post_save);
                medias.add(mediaDTO);
            }
            mediaRepository.saveAll(medias);
        }

        List<MediaResponse> medias = mediaService.getAllMediaFromIdPost(post.getId());
        response.setMedias(medias);
        //  System.err.println("medai " + medias + " " + post.getId());
        return ApiResponse.<PostResponse>builder()
                .status(true)
                .data(response)
                .message("create post").build();
    }

    private PostResponse getLastPostCreate(int post_id) {
        // System.err.println("post id"+post_id);
        Optional<Post> postOptional = postRepository.findById(post_id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            PostResponse postResponse = convertToPostResponse(post);
            return postResponse;
        } else {
            System.err.println("Post not found with id: " + post_id);
            return null;
        }
    }

    private PostResponse convertToPostResponse(Post post) {

        PostResponse response = new PostResponse();
        response.setTitle(post.getTitle());
        response.setId(post.getId());
        response.setExcerpt(post.getExcerpt());
        response.setHtmlContent(post.getHtmlContent());
        
        // System.err.println("medai " + medias + " " + post.getId());
        // System.err.println("postResponse postResponse " + post.getMedias());
        // if (post.getMedias() != null && !post.getMedias().isEmpty()) {
        //     // response.setMedias(medias);
        // }
        return response;
    }

    // public  
    private Post convertToEntity(PostRequest postDTO, User user) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setHtmlContent(postDTO.getHtmlContent());
        post.setExcerpt(postDTO.getExcerpt());
        post.setUser_posts(user);
        return post;
    }

}
