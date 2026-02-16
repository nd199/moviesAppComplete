package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;

import java.util.List;

public interface SubscriptionPlanServiceInterface {
    public SubscriptionPlan getPlan(Long planId);

    public List<SubscriptionPlan> getAllPlans();
}
