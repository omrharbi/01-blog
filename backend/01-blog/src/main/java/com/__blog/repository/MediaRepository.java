package com.__blog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.__blog.model.entity.Media;

import jakarta.transaction.Transactional;

public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findByPost_Id(UUID id);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM media WHERE posts_id = :postId", nativeQuery = true)
    Integer deleteByPostId(@Param("postId") UUID postId);
//    List<Media> deleteAllByPostId(UUID postId);

    // List<Media> findAllByPostId(UUID postId);
    // void deleteAllByPost(Post post);
}
