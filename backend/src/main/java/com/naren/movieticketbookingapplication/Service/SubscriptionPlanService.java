package com.naren.movieticketbookingapplication.Service;


import com.naren.movieticketbookingapplication.Entity.SubscriptionPlan;

import java.util.List;

public interface SubscriptionPlanService {
    public SubscriptionPlan getPlan(Long planId);

    public List<SubscriptionPlan> getAllPlans();
}

