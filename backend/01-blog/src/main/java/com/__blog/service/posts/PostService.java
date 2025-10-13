package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.request.TagsRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.dto.response.PostResponse;
import com.__blog.model.dto.response.TagsResponse;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.Tags;
import com.__blog.model.entity.User;
import com.__blog.repository.PostRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

import jakarta.transaction.Transactional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private MediaService mediaService;

    @Transactional
    public ApiResponse<PostResponse> createPost(PostRequest postRequest, UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        Post post = convertToEntity(postRequest, user);
        if ((postRequest.getMedias() != null && !postRequest.getMedias().isEmpty())) {

            for (var medai : postRequest.getMedias()) {
                var mediaDTO = mediaService.convertToMediaEntity(medai, post);
                post.addMedia(mediaDTO);
            }

        }

        if ((postRequest.getTags() != null && !postRequest.getTags().isEmpty())) {
            postRequest.getTags().forEach(tagName -> {
                var tag = convertToTagsEntity(tagName);
                post.addTag(tag);
            });
        }
        Post savedPost = postRepository.save(post);
        // Hibernate.initialize(savedPost.getMedias());
        // Hibernate.initialize(savedPost.getTags());
        PostResponse postResponse = convertToPostResponse(savedPost);
        return ApiResponse.<PostResponse>builder()
                .status(true)
                .data(postResponse)
                .error("create post").build();
    }

    public ApiResponse<PostResponse> getPostById(int postid) {
        ApiResponse<PostResponse> convResponse = getPostWithId(postid);
        return ApiResponse.<PostResponse>builder().status(true).data(convResponse.getData()).build();
    }

    private ApiResponse<PostResponse> getPostWithId(int post_id) {
        Optional<Post> postOptional = postRepository.findByIdWithMedias(post_id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            PostResponse postResponse = convertToPostResponse(post);
            return ApiResponse.<PostResponse>builder().status(true).data(postResponse).build();
        } else {
            return ApiResponse.<PostResponse>builder().status(true).error("this id is not found").build();

        }
    }

    public ApiResponse<List<PostResponse>> getPosts() {
        List<Post> posts = postRepository.findAllWithMedias();
        List<PostResponse> allPosts = new ArrayList<>();
        for (var p : posts) {
            PostResponse convert = convertToPostResponse(p);
            allPosts.add(convert);
        }
        return ApiResponse.<List<PostResponse>>builder()
                .status(true).data(allPosts).build();
    }

    private PostResponse convertToPostResponse(Post post) {
        List<MediaResponse> mediaResponses = new ArrayList<>();
        for (var media : post.getMedias()) {
            var mediaDTO = mediaService.convertToPostResponse(media);
            mediaResponses.add(mediaDTO);
        }

        List<TagsResponse> tags = new ArrayList<>();
        for (var tag : post.getTags()) {
            var tagDTO = convertToTagsResponse(tag);
            tags.add(tagDTO);
        }
        PostResponse response = PostResponse.builder().title(post.getTitle()).id(post.getId())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .htmlContent(post.getHtmlContent())
                .createdAt(post.getCreatedAt())
                .medias(mediaResponses)
                .tags(tags)
                .firstname(post.getUser_posts().getFirstname())
                .lastname(post.getUser_posts().getLastname())
                .build();

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

    private Tags convertToTagsEntity(TagsRequest tag) {
        Tags tags = new Tags();
        tags.setTags(tag.getTag());
        return tags;
    }

    private TagsResponse convertToTagsResponse(Tags tag) {
        TagsResponse tags = TagsResponse.builder().id(tag.getId()).tag(tag.getTags()).build();
        return tags;
    }
}
