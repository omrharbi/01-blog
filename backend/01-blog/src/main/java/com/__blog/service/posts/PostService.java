package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
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
        ApiResponse<PostResponse>  response = getPostWithId(post_save.getId());
        if (postRequest.getMedias() != null && !postRequest.getMedias().isEmpty()) {
            List<Media> medias = new ArrayList<>();
            for (var medai : postRequest.getMedias()) {
                var mediaDTO = mediaService.convertToMediaEntity(medai, post_save);
                medias.add(mediaDTO);
            }
            mediaRepository.saveAll(medias);
        }
        ApiResponse< List<MediaResponse>> medias = mediaService.getAllMediaFromIdPost(post.getId());
        response.getData().setMedias(medias.getData());
        return ApiResponse.<PostResponse>builder()
                .status(true)
                .data(response.getData())
                .error("create post").build();
    }

    public ApiResponse<PostResponse> getPostById(int postid) {
        ApiResponse<PostResponse> convResponse = getPostWithId(postid);
        ApiResponse< List<MediaResponse>> medias = mediaService.getAllMediaFromIdPost(convResponse.getData().getId());
        convResponse.getData().setMedias(medias.getData());
        return ApiResponse.<PostResponse>builder().status(true).data(convResponse.getData()).build();
    }

    private ApiResponse<PostResponse> getPostWithId(int post_id) {
        Optional<Post> postOptional = postRepository.findById(post_id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            PostResponse postResponse = convertToPostResponse(post);
            return ApiResponse.<PostResponse>builder().status(true).data(postResponse).build();
        } else {
            return ApiResponse.<PostResponse>builder().status(true).error("this id is not found").build();

        }
    }

    public ApiResponse<List<PostResponse>> getPosts() {
        List<Post> posts = postRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<PostResponse> allPosts = new ArrayList<>();
        for (var p : posts) {
            ApiResponse< List<MediaResponse>> mediaResponses = mediaService.getAllMediaFromIdPost(p.getId());
            PostResponse convert = convertToPostResponse(p);
            convert.setMedias(mediaResponses.getData());
            allPosts.add(convert);
        }
        return ApiResponse.<List<PostResponse>>builder()
                .status(true).data(allPosts).build();
    }

    private PostResponse convertToPostResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setTitle(post.getTitle());
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setExcerpt(post.getExcerpt());
        response.setHtmlContent(post.getHtmlContent());
        return response;
    }

    private Post convertToEntity(PostRequest postDTO, User user) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setHtmlContent(postDTO.getHtmlContent());
        post.setExcerpt(postDTO.getExcerpt());
        post.setUser_posts(user);
        return post;
    }

}
