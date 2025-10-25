package com.__blog.service.posts;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.Component.MediaMapper;
import com.__blog.Component.PostMapper;
import com.__blog.model.dto.request.MediaRequest;
import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.request.TagsRequest;
import com.__blog.model.dto.response.post.PostResponse;
import com.__blog.model.dto.response.post.PostResponseWithMedia;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.Tags;
import com.__blog.model.entity.User;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostMapper postMapper;
    @Autowired
    private MediaMapper mediaMapper;

    public ApiResponse<PostResponse> createPost(PostRequest postRequest, UserPrincipal userPrincipal) {
        User user = userPrincipal.getUser();
        Post post = postMapper.convertToEntity(postRequest);
        post.setUser(user);
        if ((postRequest.getMedias() != null && !postRequest.getMedias().isEmpty())) {
            for (var medai : postRequest.getMedias()) {
                var mediaDTO = mediaMapper.convertToMediaEntity(medai, post);
                post.addMedia(mediaDTO);
            }

        }

        if ((postRequest.getTags() != null && !postRequest.getTags().isEmpty())) {
            postRequest.getTags().forEach(tagName -> {
                var tag = postMapper.convertToTagsEntity(tagName);
                post.addTag(tag);
            });
        }
        Post savedPost = postRepository.save(post);

        PostResponse postResponse = postMapper.ConvertPostResponse(savedPost, user.getId());
        return ApiResponse.<PostResponse>builder()
                .status(true)
                .data(postResponse)
                .error("create post").build();
    }

    public ApiResponse<PostResponse> editPost(PostRequest postRequest, UUID id, UUID userId) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            Post existingPost = post.get();
            existingPost.setTitle(postRequest.getTitle());
            existingPost.setContent(postRequest.getContent());
            existingPost.setHtmlContent(postRequest.getHtmlContent());
            existingPost.setExcerpt(postRequest.getExcerpt());

            if (postRequest.getMedias() != null) {
                existingPost.getMedias().clear();
                for (MediaRequest tagRequest : postRequest.getMedias()) {
                    Media media = mediaMapper.convertToMediaEntity(tagRequest, existingPost);
                    existingPost.addMedia(media);
                }
            }

            if (postRequest.getTags() != null) {
                existingPost.getTags().clear();
                for (TagsRequest tagRequest : postRequest.getTags()) {
                    Tags tag = postMapper.convertToTagsEntity(tagRequest);
                    existingPost.addTag(tag);
                }
            }
            Post savedPost = postRepository.save(existingPost);

            PostResponse response = postMapper.ConvertPostResponse(savedPost, userId);
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

    public ApiResponse<PostResponseWithMedia> getPostById(UUID postid, UUID userId) {
        ApiResponse<PostResponseWithMedia> convResponse = getPostId(postid, userId);
        return ApiResponse.<PostResponseWithMedia>builder().status(true).data(convResponse.getData()).build();
    }

    private ApiResponse<PostResponseWithMedia> getPostId(UUID post_id, UUID userId) {
        Optional<Post> postOptional = postRepository.findByIdWithMedias(post_id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            PostResponseWithMedia postResponse = postMapper.convertToPostWithMediaResponse(post, userId);
            return ApiResponse.<PostResponseWithMedia>builder().status(true).data(postResponse).build();
        } else {
            return ApiResponse.<PostResponseWithMedia>builder().status(true).error("this id is not found").build();

        }
    }

    public ApiResponse<List<PostResponse>> getPostsFromUserId(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            Optional<List<Post>> posts = postRepository.findByUserId(user.get().getId());
            if (posts.isPresent()) {

                List<PostResponse> postResponses = new ArrayList<>();
                for (var post : posts.get()) {
                    Hibernate.initialize(post.getTags());

                    PostResponse postDTO = postMapper.ConvertPostResponse(post, user.get().getId());
                    postResponses.add(postDTO);
                }

                return ApiResponse.<List<PostResponse>>builder().status(true).data(postResponses).build();
            } else {
                return ApiResponse.<List<PostResponse>>builder().status(false).error("Error to Get this Post").build();
            }
        } else {
            return ApiResponse.<List<PostResponse>>builder().status(false).error("Error to Get this User Post").build();

        }

    }

    public ApiResponse<List<PostResponse>> getPosts(UUID userId) {
        List<Post> posts = postRepository.findAllWithMedias();
        // postRepository.existsById(id)
        List<PostResponse> allPosts = new ArrayList<>();
        for (var p : posts) {
            PostResponse convert = postMapper.ConvertPostResponse(p, userId);
            allPosts.add(convert);
        }
        return ApiResponse.<List<PostResponse>>builder()
                .status(true).data(allPosts).build();
    }

    public UUID deletePost(UUID postId) {

        var post = postRepository.findById(postId);
        if (post.isPresent()) {
            postRepository.deleteById(postId);
        }
        return post.get().getId(); 
    }
}
