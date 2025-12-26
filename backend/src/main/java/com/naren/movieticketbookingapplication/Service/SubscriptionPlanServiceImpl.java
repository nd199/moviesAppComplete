package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.SubscriptionPlan;
import com.naren.movieticketbookingapplication.Repo.SubscriptionPlanRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubscriptionPlanServiceImpl implements SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;

    public SubscriptionPlanServiceImpl(SubscriptionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public SubscriptionPlan getPlan(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    @Override
    public List<SubscriptionPlan> getAllPlans() {
        return planRepository.findAll();
    }
}