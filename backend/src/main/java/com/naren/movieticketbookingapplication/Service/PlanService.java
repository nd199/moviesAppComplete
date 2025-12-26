package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.SubscriptionPlan;

public interface PlanService {

    SubscriptionPlan findById(Long id);
}
