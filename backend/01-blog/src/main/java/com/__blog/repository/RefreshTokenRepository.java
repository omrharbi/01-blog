package com.__blog.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.RefreshToken;
import com.__blog.model.entity.User;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUser(User user);
   Optional<RefreshToken> findByUserId(int userId);


    @Modifying
    int deleteByUser(User user);
}
