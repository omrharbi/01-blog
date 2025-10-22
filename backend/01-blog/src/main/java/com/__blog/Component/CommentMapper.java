package com.__blog.Component;

import org.springframework.stereotype.Component;

import com.__blog.model.dto.request.CommentRequest;
import com.__blog.model.dto.response.CommentResponse;
import com.__blog.model.entity.Comment;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;

@Component
public class CommentMapper {

    public Comment convertToEntityComment(CommentRequest request, Post post, User user) {
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(user);
        return comment;
    }

    public CommentResponse convertToResponseComment(Comment comment) {
        CommentResponse commentResponse = CommentResponse.builder()
                .Content(comment.getContent())
                .avatar(comment.getUser().getAvatarUrl())
                .firstname(comment.getUser().getFirstname())
                .lastname(comment.getUser().getLastname())
                .createdAt(comment.getCreate_at())
                // .parentCommentId(comment.getParentComment().getId() )
                // .replies(comment.getReplies())
                .build();
        return commentResponse;
    }
}
