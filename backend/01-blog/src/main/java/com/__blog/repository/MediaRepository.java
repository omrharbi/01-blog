package com.__blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.__blog.model.entity.Media;

public interface MediaRepository extends JpaRepository<Media, Integer> {

}
