package com.__blog.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.__blog.Component.CommentMapper;
import com.__blog.model.dto.request.CommentRequest;
import com.__blog.model.dto.response.CommentResponse;
import com.__blog.model.entity.Comment;
import com.__blog.model.entity.Post;
import com.__blog.model.entity.User;
import com.__blog.repository.CommentRespository;
import com.__blog.repository.PostRepository;
import com.__blog.repository.UserRepository;
import com.__blog.security.UserPrincipal;
import com.__blog.util.ApiResponse;

import jakarta.transaction.Transactional;

@Service
public class CommentService {

    @Autowired
    private CommentRespository commentRespository;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CommentMapper commentMapper;
    @Transactional
    public ApiResponse<CommentResponse> AddComment(UserPrincipal userPrincipal, CommentRequest request) {
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        Optional<Post> post = postRepository.findById(request.getPostId());
        if (post.isPresent() && user.isPresent()) {
            Comment comment = commentMapper.convertToEntityComment(request, post.get(), user.get());

            if (request.getParentCommentId() != null) {
                Optional<Comment> parentComment=commentRespository.findById(request.getParentCommentId());
                if (parentComment.isPresent()){
                    comment.setParentComment(parentComment.get());
                }
            }

            commentRespository.save(comment);
            CommentResponse response = commentMapper.convertToResponseComment(comment, user.get());
            return ApiResponse.<CommentResponse>builder()
                    .status(true)
                    .message("create Comment")
                    .data(response)
                    .build();
        }

        return ApiResponse.<CommentResponse>builder()
                .status(false)
                .error("Cannot create Comment ")
                // .data(response)
                .build();
    }

}
