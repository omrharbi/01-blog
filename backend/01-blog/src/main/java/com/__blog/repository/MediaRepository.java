package com.__blog.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.__blog.model.entity.Media;

public interface MediaRepository extends JpaRepository<Media, Integer> {

    List<Media> findByPost_Id(Integer id);
}
