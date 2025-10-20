package com.__blog.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    @Query("SELECT DISTINCT p FROM Post p "
            + "LEFT JOIN FETCH p.medias "
            + "LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.user "
            + " WHERE p.id = :postId")
    Optional<Post> findByIdWithMedias(@Param("postId") UUID id);

    @Query("SELECT DISTINCT p FROM Post p "
            + "LEFT JOIN FETCH p.medias "
            + "LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.user "
            + // Add this line
            "ORDER BY p.createdAt DESC")
    List<Post> findAllWithMedias();

    Optional<List<Post>> findByUserId(UUID id);

    int countByUserId(UUID id);

    int countByCommentsPostId(UUID id);

    int countBylikesPostId(UUID id);

    boolean existsByLikesPostIdAndLikesUserId(UUID postId, UUID userId);
}
