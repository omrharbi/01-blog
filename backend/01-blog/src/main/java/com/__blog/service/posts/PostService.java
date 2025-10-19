package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.request.TagsRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.dto.response.TagsResponse;
import com.__blog.model.dto.response.post.PostResponse;
import com.__blog.model.dto.response.post.PostResponseWithMedia;
import com.__blog.model.entity.Media;
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
        Post post = convertToEntity(postRequest);
        post.setUser(user);
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
        PostResponse postResponse = ConvertPostResponse(savedPost);
        return ApiResponse.<PostResponse>builder()
                .status(true)
                .data(postResponse)
                .error("create post").build();
    }

    @Transactional
    public ApiResponse<PostResponse> editPost(PostRequest postRequest, UUID id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            Post existingPost = post.get();
            List<Media> mediaDelete = mediaService.deleteAllmedia(existingPost.getId());
            for (var v : mediaDelete) {
                System.err.println("*********************" + v.getFilename());

            }

            existingPost.setTitle(postRequest.getTitle());
            existingPost.setContent(postRequest.getContent());
            existingPost.setHtmlContent(postRequest.getHtmlContent());
            existingPost.setExcerpt(postRequest.getExcerpt());

            if (postRequest.getMedias() != null) {
                existingPost.getMedias().clear();
                for (MediaRequest tagRequest : postRequest.getMedias()) {
                    Media media = mediaService.convertToMediaEntity(tagRequest, existingPost);
                    existingPost.addMedia(media);
                }
            }

            if (postRequest.getTags() != null) {
                existingPost.getTags().clear();
                for (TagsRequest tagRequest : postRequest.getTags()) {
                    Tags tag = convertToTagsEntity(tagRequest);
                    existingPost.addTag(tag);
                }
            }
            Post savedPost = postRepository.save(existingPost);
            PostResponse response = ConvertPostResponse(savedPost);
            return ApiResponse.<PostResponse>builder()
                    .status(true)
                    .data(response)
                    .message("update post").build();
        }
        return ApiResponse.<PostResponse>builder()
                .status(true)
                .error("error")
                .error("create post").build();
    }

    public ApiResponse<PostResponseWithMedia> getPostById(UUID postid) {
        ApiResponse<PostResponseWithMedia> convResponse = getPostId(postid);
        return ApiResponse.<PostResponseWithMedia>builder().status(true).data(convResponse.getData()).build();
    }

    // this func 
    private ApiResponse<PostResponseWithMedia> getPostId(UUID post_id) {
        Optional<Post> postOptional = postRepository.findByIdWithMedias(post_id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            PostResponseWithMedia postResponse = convertToPostWithMediaResponse(post);
            return ApiResponse.<PostResponseWithMedia>builder().status(true).data(postResponse).build();
        } else {
            return ApiResponse.<PostResponseWithMedia>builder().status(true).error("this id is not found").build();

        }
    }

    @Transactional
    public ApiResponse<List<PostResponse>> getPostsFromUserId(UUID id) {
        Optional<List<Post>> posts = postRepository.findByUserId(id);
        if (posts.isPresent()) {

            List<PostResponse> postResponses = new ArrayList<>();
            for (var post : posts.get()) {
                Hibernate.initialize(post.getTags());
                PostResponse postDTO = ConvertPostResponse(post);
                postResponses.add(postDTO);
            }

            return ApiResponse.<List<PostResponse>>builder().status(true).data(postResponses).build();
        } else {
            return ApiResponse.<List<PostResponse>>builder().status(false).error("Error to Get this Post").build();
        }

    }

    public ApiResponse<List<PostResponse>> getPosts() {
        List<Post> posts = postRepository.findAllWithMedias();
        List<PostResponse> allPosts = new ArrayList<>();
        for (var p : posts) {
            PostResponse convert = ConvertPostResponse(p);
            allPosts.add(convert);
        }
        return ApiResponse.<List<PostResponse>>builder()
                .status(true).data(allPosts).build();
    }

    private PostResponseWithMedia convertToPostWithMediaResponse(Post post) {
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
        PostResponseWithMedia response = PostResponseWithMedia.builder().title(post.getTitle()).id(post.getId())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .htmlContent(post.getHtmlContent())
                .uuid_user(post.getUser().getId())
                .createdAt(post.getCreatedAt())
                .medias(mediaResponses)
                .avater_user(post.getUser().getAvatarUrl())
                .tags(tags)
                .firstname(post.getUser().getFirstname())
                .lastname(post.getUser().getLastname())
                .build();

        return response;
    }

    private PostResponse ConvertPostResponse(Post post) {
        List<TagsResponse> tags = new ArrayList<>();
        for (var tag : post.getTags()) {
            var tagDTO = convertToTagsResponse(tag);
            tags.add(tagDTO);
        }
        Optional<Media> firstImage = post.getMedias().stream().findFirst();
        String image = "";
        if (firstImage.isPresent()) {
            image = firstImage.get().getFilePath();
        }
        PostResponse postResponse = PostResponse.builder()
                .id(post.getId())
                .uuid_user(post.getUser().getId())
                .firstImage(image)
                .content(post.getContent())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .avater_user(post.getUser().getAvatarUrl())
                .tags(tags)
                .build();

        return postResponse;
    }

    private Post convertToEntity(PostRequest postDTO) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setHtmlContent(postDTO.getHtmlContent());
        post.setExcerpt(postDTO.getExcerpt());
        // post.setUser_posts(user);
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
