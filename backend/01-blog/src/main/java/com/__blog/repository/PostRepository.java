package com.__blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer> {
    
}
