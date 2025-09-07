package com.__blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {

}
