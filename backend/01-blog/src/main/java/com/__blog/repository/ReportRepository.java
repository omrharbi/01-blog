package com.__blog.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    // List<Tag> findByPostId(Long postId);
    // List<Tag> findByNameContainingIgnoreCase(String name);
    // Integer count

    // findTrendingTags();
}
