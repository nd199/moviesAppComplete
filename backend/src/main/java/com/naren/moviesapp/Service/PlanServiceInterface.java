package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;

public interface PlanServiceInterface {

    SubscriptionPlan findById(Long id);
}
