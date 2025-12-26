package com.naren.movieticketbookingapplication.Repo;

import com.naren.movieticketbookingapplication.Entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    boolean existsByPlanName(String planName);
}
