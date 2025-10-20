package com.__blog.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Subscription;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
// Get all subscriptions where I am the subscriber (users I follow)

    List<Subscription> findBySubscriberUser_Id(UUID subscriberId);

    // Get all subscriptions where I am subscribed to (followers)
    List<Subscription> findBySubscribedTo_Id(UUID subscribedToId);
// Get users that a specific user is NOT following

    // @Query("SELECT u FROM User u WHERE u.id != :userId AND u.id NOT IN "
    //         + "(SELECT s.subscribedTo.id FROM Subscription s WHERE s.subscriberUser.id = :userId)")
    Optional<Subscription> findBySubscriberUser_IdAndSubscribedTo_Id(UUID subscriberId, UUID subscribedToId);

// Count followers (users following this person)
    int countBySubscriberUser_Id(UUID subscriberId);
    // Count following (users this person follows)

    int countBySubscribedTo_Id(UUID subscribedToId);
    // boolean existsBySubscriber_User_IdAndSubscribedTo_Id(UUID subscriberId, UUID subscribedToId);

    // Delete subscription
    // void deleteBySubscriber_User_IdAndSubscribedTo_Id(UUID subscriberId, UUID subscribedToId);
}
