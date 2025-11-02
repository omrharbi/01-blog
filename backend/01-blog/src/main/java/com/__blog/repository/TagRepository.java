package com.__blog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Tags;

 @Repository
public interface  TagRepository extends  JpaRepository<Tags, UUID>{
//   List<Tag> findByPostId(Long postId);
//     List<Tag> findByNameContainingIgnoreCase(String name);  
    // Integer count

    @Query("SELECT t.tags as tagName, COUNT(t) as postCount "
            + "FROM Tags t "
            + "GROUP BY t.tags "
            + "ORDER BY COUNT(t) DESC")
    List<Object[]> findTrendingTags();
    List<Tags> findAlTagseByPostId(UUID postId);

    @Query("""
            SELECT t
            FROM Tags t
            WHERE t.post.id IN :postIds
            """)
    List<Tags> findAllByPostIdInTags(@Param("postIds") List<UUID> postIds);

}
