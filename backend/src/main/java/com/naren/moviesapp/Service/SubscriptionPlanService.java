package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionPlanService implements SubscriptionPlanServiceInterface {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionPlanService.class);
    private final SubscriptionPlanRepository planRepository;

    public SubscriptionPlanService(SubscriptionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public SubscriptionPlan getPlan(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        List<SubscriptionPlan> plans = planRepository.findAll();
        log.debug("Fetched {} subscription plans", plans.size());
        return plans;
    }
}