package com.__blog.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.__blog.model.dto.response.post.PostReportToAdminResponse;
import com.__blog.model.dto.response.post.PostResponse;
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
    Page<Post> findAllWithMedias(Pageable pageable);

    @Query("""
                    SELECT new com.__blog.model.dto.response.post.PostResponse(
                        p.id,
                        u.id,
                        p.title,
                        p.content,
                        p.createdAt,
                        (SELECT m2.filePath FROM Media m2 WHERE m2.post.id = p.id ORDER BY m2.displayOrder ASC LIMIT 1),
                        u.firstname,
                        u.lastname,
                        u.username
                    )
                    FROM Post p
                LEFT JOIN p.user u
                LEFT JOIN p.likes l
                LEFT JOIN p.comments c
                LEFT JOIN Report r ON r.post = p
                WHERE p.createdAt <= :snapshotTime
                 GROUP BY
                p.id,
                p.title,
                p.content,
                p.createdAt,
                u.id,
                u.firstname,
                u.lastname,
                u.username
            ORDER BY COUNT(DISTINCT r) DESC, p.createdAt DESC
                    """)
    Page<PostResponse> findAllPostsWithFirstMedia(@Param("snapshotTime") LocalDateTime snapshotTime,
            Pageable pageable);

    @Query("""
                SELECT p FROM Post p
    WHERE p.user.id = :userId
      AND (p.createdAt <= :snapshotTime)
    ORDER BY p.createdAt DESC
            """)
    Page<Post> findByUserIdOrderByCreatedAtDesc(
            @Param("userId") UUID userId,
            @Param("snapshotTime") LocalDateTime snapshotTime,
            Pageable pageable);

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
                    u.role,
                    u.hidden,
                    p.createdAt,
                    COUNT(DISTINCT l),
                    COUNT(DISTINCT c),
                    COUNT(DISTINCT r)
                )
                FROM Post p
                LEFT JOIN p.user u
                LEFT JOIN p.likes l
                LEFT JOIN p.comments c
                LEFT JOIN Report r ON r.post = p
                GROUP BY p.id, p.title, u.firstname, u.lastname, p.createdAt,  u.role, u.hidden
                ORDER BY COUNT(DISTINCT r) DESC
            """)
    Page<PostReportToAdminResponse> getPostsReportForAdmin(Pageable pageable);

    // PostRepository.java

    // Method 1: Simple batch queries (RECOMMENDED)
    @Query("""
            SELECT p.id, COUNT(l.id)
            FROM Post p
            LEFT JOIN p.likes l
            WHERE p.id IN :postIds
            GROUP BY p.id
            """)
    List<Object[]> countLikesByPostIds(@Param("postIds") List<UUID> postIds);

    @Query("""
            SELECT p.id, COUNT(c.id)
            FROM Post p
            LEFT JOIN p.comments c
            WHERE p.id IN :postIds
            GROUP BY p.id
            """)
    List<Object[]> countCommentsByPostIds(@Param("postIds") List<UUID> postIds);

    @Query("""
            SELECT l.post.id
            FROM Like l
            WHERE l.post.id IN :postIds
            AND l.user.id = :userId
            """)
    Set<UUID> findUserLikedPostIds(@Param("postIds") List<UUID> postIds, @Param("userId") UUID userId);

}
