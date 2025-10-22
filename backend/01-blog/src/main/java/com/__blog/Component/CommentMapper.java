package com.__blog.Component;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.__blog.model.dto.request.CommentRequest;
import com.__blog.model.dto.response.CommentResponse;
import com.__blog.model.entity.Comment;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.repository.CommentRespository;

@Component
public class CommentMapper {

    @Autowired
    private CommentRespository commentRespository;

    public Comment convertToEntityComment(CommentRequest request, Post post, User user) {
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(user);
        return comment;
    }

    public CommentResponse convertToResponseComment(Comment comment, UUID userid) {

        boolean isLiked = commentRespository.existsByLikesCommentIdAndLikesUserId(comment.getId(), userid);
        int countLike = commentRespository.countBylikesCommentId(comment.getId());
        CommentResponse commentResponse = CommentResponse.builder()
                .id(comment.getId())
                .Content(comment.getContent())
                .avatar(comment.getUser().getAvatarUrl())
                .firstname(comment.getUser().getFirstname())
                .lastname(comment.getUser().getLastname())
                .createdAt(comment.getCreateAt())
                .isLiked(isLiked)
                .likesCount(countLike)
                // .parentCommentId(comment.getParentComment().getId() )
                // .replies(comment.getReplies())
                .build();
        return commentResponse;
    }
}
