package com.__blog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Comment;

@Repository
public interface CommentRespository extends JpaRepository<Comment, UUID> {

    @EntityGraph(attributePaths = {"user", "post"})
    List<Comment> findByPostIdOrderByCreateAtDesc(UUID postId);

    int countBylikesCommentId(UUID id);
   boolean existsByLikesCommentIdAndLikesUserId(UUID commentId,UUID userId);
 }
