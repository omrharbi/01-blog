package com.__blog.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
 import com.__blog.repository.MediaRepository;
import com.__blog.repository.PostRepository;
import com.__blog.repository.TagRepository;
 
@Component

public class PostMapper {

    @Autowired
    private MediaMapper mediaMapper;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private MediaRepository mediaRepository;

    // @Autowired
    // private UserRepository userRepository;

    public PostResponseWithMedia convertToPostWithMediaResponse(Post post, UUID userid) {

        boolean isLiked = postRepository.existsByLikesPostIdAndLikesUserId(post.getId(), userid);
        int countComment = postRepository.countByCommentsPostId(post.getId());
        int countLike = postRepository.countBylikesPostId(post.getId());
        List<MediaResponse> mediaResponses = new ArrayList<>();
        for (var media : post.getMedias()) {
            var mediaDTO = mediaMapper.convertToPostResponse(media);
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

    public Page<PostResponse> ConvertPostResponse(Page<PostResponse> basicPosts, UUID userId) {
        List<UUID> postIds = basicPosts.getContent().stream()
                .map(PostResponse::getId)
                .collect(Collectors.toList());
        Map<UUID, Long> likeCounts = getLikeCountsMap(postIds);
        Map<UUID, Long> commentCounts = getCommentCountsMap(postIds);
        Set<UUID> userLikedPostIds = postRepository.findUserLikedPostIds(postIds, userId);
        Map<UUID, List<MediaResponse>> mediaMap = getMediaMap(postIds);
        Map<UUID, List<TagsResponse>> tagsMap = getTagsMap(postIds);

        Page<PostResponse> enrichedPosts = basicPosts.map(post -> PostResponse.builder()
                .id(post.getId())
                .uuid_user(post.getUuid_user())
                .title(post.getTitle())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .firstImage(post.getFirstImage())
                // User info already fetched
                .avatarUser(post.getAvatarUser())
                .username(post.getUsername())
                .firstname(post.getFirstname())
                .lastname(post.getLastname())
                // Enriched data
                .tags(tagsMap.getOrDefault(post.getId(), Collections.emptyList()))
                .medias(mediaMap.getOrDefault(post.getId(), Collections.emptyList()))
                .isLiked(userLikedPostIds.contains(post.getId()))
                .likesCount(likeCounts.getOrDefault(post.getId(), 0L).intValue())
                .commentCount(commentCounts.getOrDefault(post.getId(), 0L).intValue())
                .build());

        return enrichedPosts;
    }

    private Map<UUID, Long> getLikeCountsMap(List<UUID> postIds) {
        List<Object[]> results = postRepository.countLikesByPostIds(postIds);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (UUID) row[0],
                        row -> (Long) row[1]));
    }

    private Map<UUID, Long> getCommentCountsMap(List<UUID> postIds) {
        List<Object[]> results = postRepository.countCommentsByPostIds(postIds);
        return results.stream()
                .collect(Collectors.toMap(
                        row -> (UUID) row[0],
                        row -> (Long) row[1]));
    }

    private Map<UUID, List<MediaResponse>> getMediaMap(List<UUID> postIds) {
        List<Media> allMedia = mediaRepository.findAllByPostIdInMedia(postIds);
        return allMedia.stream()
                .collect(Collectors.groupingBy(
                        media -> media.getPost().getId(),
                        Collectors.mapping(
                                media -> mediaMapper.convertToPostResponse(media),
                                Collectors.toList())));
    }

    private Map<UUID, List<TagsResponse>> getTagsMap(List<UUID> postIds) {
        List<Tags> allTags = tagRepository.findAllByPostIdInTags(postIds);
        return allTags.stream()
                .collect(Collectors.groupingBy(
                        tag -> tag.getPost().getId(),
                        Collectors.mapping(
                                tag -> convertToTagsResponse(tag),
                                Collectors.toList())));
    }

    // private Map<UUID, User> getUsersMap(List<PostResponse> posts) {
    //     Set<UUID> userIds = posts.stream()
    //             .map(PostResponse::getUuid_user)
    //             .collect(Collectors.toSet());

    //     List<User> users = userRepository.findAllById(userIds);
    //     return users.stream()
    //             .collect(Collectors.toMap(User::getId, user -> user));
    // }

    public Post convertToEntity(PostRequest postDTO) {
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setHtmlContent(postDTO.getHtmlContent());
        post.setExcerpt(postDTO.getExcerpt());
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
