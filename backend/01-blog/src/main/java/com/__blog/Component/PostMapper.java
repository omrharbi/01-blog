package com.__blog.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.__blog.model.dto.request.PostRequest;
import com.__blog.model.dto.request.TagsRequest;
import com.__blog.model.dto.response.MediaResponse;
import com.__blog.model.dto.response.TagsResponse;
import com.__blog.model.dto.response.post.PostResponse;
import com.__blog.model.dto.response.post.PostResponseWithMedia;
import com.__blog.model.entity.Media;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.Tags;
import com.__blog.repository.PostRepository;

@Component
public class PostMapper {

    @Autowired
    private MediaMapper mediaMapper;

    @Autowired
    private PostRepository postRepository;

    public PostResponseWithMedia convertToPostWithMediaResponse(Post post, UUID userid) {

        boolean isLiked = postRepository.existsByLikesPostIdAndLikesUserId(post.getId(), userid);
        int countComment = postRepository.countByCommentsPostId(post.getId());
        int countLike = postRepository.countBylikesPostId(post.getId());
        List<MediaResponse> mediaResponses = new ArrayList<>();
        for (var media : post.getMedias()) {
            var mediaDTO = mediaMapper.convertToPostResponse(media);
            System.out.println("PostMapper.convertToPostWithMediaResponse()"+mediaDTO.getFilePath());
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
                .avatarUser(post.getUser().getAvatarUrl())
                 .username(post.getUser().getUsername())
                .tags(tags)
                .isLiked(isLiked)
                .commentCount(countComment)
                .likesCount(countLike)
                .firstname(post.getUser().getFirstname())
                .lastname(post.getUser().getLastname())
                .build();

        return response;
    }

    public PostResponse ConvertPostResponse(Post post, UUID userid) {
        boolean isLiked = postRepository.existsByLikesPostIdAndLikesUserId(post.getId(), userid);
        int countComment = postRepository.countByCommentsPostId(post.getId());
        int countLike = postRepository.countBylikesPostId(post.getId());
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
                .firstname(post.getUser().getUsername())
                .lastname(post.getUser().getLastname())
                .content(post.getContent())
                .title(post.getTitle())
                .createdAt(post.getCreatedAt())
                .username(post.getUser().getUsername())
                .avatarUser(post.getUser().getAvatarUrl())
                .tags(tags)
                .isLiked(isLiked)
                .commentCount(countComment)
                .likesCount(countLike)
                .build();

        return postResponse;
    }

    public Post convertToEntity(PostRequest postDTO) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setHtmlContent(postDTO.getHtmlContent());
        post.setExcerpt(postDTO.getExcerpt());
        // post.setUser_posts(user);
        return post;
    }

    public Tags convertToTagsEntity(TagsRequest tag) {
        Tags tags = new Tags();
        tags.setTags(tag.getTag());
        return tags;
    }

    public TagsResponse convertToTagsResponse(Tags tag) {
        TagsResponse tags = TagsResponse.builder().id(tag.getId()).tag(tag.getTags()).build();
        return tags;
    }
}
