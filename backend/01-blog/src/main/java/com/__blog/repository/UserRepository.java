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

import com.__blog.model.entity.User;
import com.__blog.model.enums.Roles;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("SELECT s FROM User u JOIN u.skills s WHERE u.id = :userId")
    Set<String> findSkillsByUserId(@Param("userId") UUID userId);

    Page<User> findByRole(Roles role, Pageable pageable);

    Page<User> findByHidden(boolean status, Pageable pageable);
    @Query("""
                SELECT u FROM User u
                WHERE u.id <> :userId
                  AND u.id NOT IN (
                      SELECT s.subscribedTo.id FROM Subscription s WHERE s.subscriberUser.id = :userId
                  )
            """)
    Page<User> findUsersNotFollowedBy(@Param("userId") UUID userId, Pageable pageable);
}
