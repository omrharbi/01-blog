package com.__blog.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {

    Optional<Like> findByUserIdAndPostId(UUID userId, UUID postid);
    Optional<List<Like>> findByUserId(UUID userId);
}
