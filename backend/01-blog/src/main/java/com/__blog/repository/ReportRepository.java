package com.__blog.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {

    @Query("""
        SELECT r FROM Report r WHERE r.post IS NOT NULL    
        """
    )
    Page<Report> findAllPostReports(Pageable pageable);

    @Query("""
        SELECT r FROM Report r WHERE r.post IS   NULL  AND   r.comment IS NULL
        """
    )
    Page<Report> findAllUserReports(Pageable pageable);

}
