package com.__blog.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.__blog.model.dto.response.post.PostReportToAdminResponse;
import com.__blog.model.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {

    @Query("SELECT DISTINCT p FROM Post p "
            + "LEFT JOIN FETCH p.medias "
            + "LEFT JOIN FETCH p.tags "
            + "LEFT JOIN FETCH p.user "
            + " WHERE p.id = :postId")
    Optional<Post> findByIdWithMedias(@Param("postId") UUID id);

    @Query("""
    SELECT DISTINCT p FROM Post p 
             LEFT JOIN FETCH p.medias 
             LEFT JOIN FETCH p.tags 
             LEFT JOIN FETCH p.user 
             ORDER BY p.createdAt DESC  """)
    List<Post> findAllWithMedias();

    Optional<List<Post>> findByUserId(UUID id);

    int countByUserId(UUID id);

    int countByCommentsPostId(UUID id);

    int countBylikesPostId(UUID id);

    boolean existsByLikesPostIdAndLikesUserId(UUID postId, UUID userId);

    boolean existsByHiddenFalse();

    List<Post> findByLikesUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("""
        SELECT new com.__blog.model.dto.response.post.PostReportToAdminResponse(
            p.id,
            p.title,
            u.firstname,
            u.lastname,
            p.createdAt,
            COUNT(DISTINCT l), 
            COUNT(DISTINCT c), 
            COUNT(DISTINCT r)
        )
        FROM Post p
        LEFT JOIN p.user u
        LEFT JOIN p.likes l
        LEFT JOIN p.comments c
        LEFT JOIN p.reports r
        GROUP BY p.id, p.title, u.firstname, u.lastname, p.createdAt
        ORDER BY COUNT(DISTINCT r) DESC
    """)
    List<PostReportToAdminResponse> getPostsReportForAdmin();

   

}
