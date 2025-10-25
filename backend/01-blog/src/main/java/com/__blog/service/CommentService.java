package com.__blog.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    public ApiResponse<CommentResponse> AddComment(UserPrincipal userPrincipal, CommentRequest request) {
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        Optional<Post> post = postRepository.findById(request.getPostId());
        if (post.isPresent() && user.isPresent()) {
            Comment comment = commentMapper.convertToEntityComment(request, post.get(), user.get());

            if (request.getParentCommentId() != null) {
                Optional<Comment> parentComment = commentRespository.findById(request.getParentCommentId());
                if (parentComment.isPresent()) {
                    comment.setParentComment(parentComment.get());
                }
            }

            commentRespository.save(comment);
            CommentResponse response = commentMapper.convertToResponseComment(comment, userPrincipal.getId());
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

    public ApiResponse<List<CommentResponse>> getCommentWithPost(UUID postId, UserPrincipal userPrincipal) {

        List<Comment> AllCommentByPost = commentRespository.findByPostIdOrderByCreateAtDesc(postId);
        if (AllCommentByPost != null) {
            List<CommentResponse> commentResponses = new ArrayList<>();
            for (var comment : AllCommentByPost) {
                CommentResponse commentResponse = commentMapper.convertToResponseComment(comment, userPrincipal.getId());
                if (commentResponse.getParentCommentId() == null) {
                }
                commentResponses.add(commentResponse);
            }

            return ApiResponse.<List<CommentResponse>>builder()
                    .status(false)
                    .error("Cannot create Comment ")
                    .data(commentResponses)
                    .build();
        }
        return ApiResponse.<List<CommentResponse>>builder()
                .status(false)
                .error("Cannot create Comment ")
                // .data(response)
                .build();
    }

    public ApiResponse<CommentResponse> editPost(UUID commentId, CommentRequest commentRequest, UUID userId) {
        // var 
        var findcomment = commentRespository.findById(commentId);
        Optional<Post> post = postRepository.findById(commentRequest.getPostId());
        if (findcomment.isPresent() && post.isPresent()) {
            Comment saveNewComment = findcomment.get();
            saveNewComment.setContent(commentRequest.getContent());
            // saveNewComment.setPost(post.get());
            
            commentRespository.save(saveNewComment);
            
            CommentResponse commentResponse = commentMapper.convertToResponseComment(saveNewComment, commentId);
            return ApiResponse.<CommentResponse>builder()
            .status(true)
            .error(" edit  Comment ")
            .data(commentResponse)
            .build();
        }
        System.err.println("*************0"+findcomment.isPresent());
        return ApiResponse.<CommentResponse>builder()
        .status(false)
        .error("Cannot create Comment ")
        // .data(response)
                .build();
    }



    public ApiResponse<CommentResponse> delete(UUID commentId) {
        // var 
        var findcomment = commentRespository.findById(commentId);
         if (findcomment.isPresent() ) { 
            commentRespository.deleteById(commentId);
            
            CommentResponse commentResponse = commentMapper.convertToResponseComment(findcomment.get(), commentId);
            return ApiResponse.<CommentResponse>builder()
            .status(true)
            .error(" edit  Comment ")
            .data(commentResponse)
            .build();
        }
        System.err.println("*************0"+findcomment.isPresent());
        return ApiResponse.<CommentResponse>builder()
        .status(false)
        .error("Cannot create Comment ")
        // .data(response)
                .build();
    }
}
