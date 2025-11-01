package com.__blog.repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.__blog.model.dto.response.admin.UserResponseToAdmin;
import com.__blog.model.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
    @Query("SELECT s FROM users u JOIN u.skills s WHERE u.id = :userId")
    Set<String> findSkillsByUserId(@Param("userId") UUID userId);
    @Query("""
             SELECT new com.__blog.model.dto.response.admin.UserResponseToAdmin(u.id, u.username, u.status , u.email,  COUNT(p) )
             FROM users u 
             LEFT JOIN  u.posts p
             GROUP BY u.id, u.username , u.status, u.email
             ORDER BY COUNT(p) DESC
            """)
    Page<UserResponseToAdmin> findAllUsersWithPostCount(Pageable pageable);
    // Long countUsers();
}
