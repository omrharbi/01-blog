package com.__blog.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.__blog.model.entity.Subscription;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findBySubscriberUser_Id(UUID subscriberId);
    
    List<Subscription> findBySubscribedTo_Id(UUID subscribedToId);

    // boolean existsBySubscriber_User_IdAndSubscribedTo_Id(UUID subscriberId, UUID subscribedToId);

    // Delete subscription
    // void deleteBySubscriber_User_IdAndSubscribedTo_Id(UUID subscriberId, UUID subscribedToId);
}
