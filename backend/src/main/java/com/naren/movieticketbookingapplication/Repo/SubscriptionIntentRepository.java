package com.naren.movieticketbookingapplication.Repo;

import com.naren.movieticketbookingapplication.Entity.SubscriptionIntent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionIntentRepository extends JpaRepository<SubscriptionIntent, Long> {
    boolean existsByUserIdAndPlanId(Long userId, Long planId);

    Optional<SubscriptionIntent> findByIntentToken(String token);

    Optional<SubscriptionIntent> findByUserId(Long userId);
}
