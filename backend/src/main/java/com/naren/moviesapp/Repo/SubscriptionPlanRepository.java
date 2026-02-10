package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    boolean existsByPlanName(String planName);
}
