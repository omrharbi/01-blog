package com.__blog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.__blog.model.entity.Media;

import jakarta.transaction.Transactional;

public interface MediaRepository extends JpaRepository<Media, UUID> {

    List<Media> findByPost_Id(UUID id);

    // @Query(value = "DELETE FROM media WHERE posts_id = :postId", nativeQuery = true)
    // Integer deleteByPostId(UUID postId);
    @Transactional
    Integer deleteByPost_Id(UUID postId);
//    List<Media> deleteAllByPostId(UUID postId);

    // List<Media> findAllByPostId(UUID postId);
    // void deleteAllByPost(Post post);
}
