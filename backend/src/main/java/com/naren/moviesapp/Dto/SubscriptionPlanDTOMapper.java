package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class SubscriptionPlanDTOMapper implements Function<SubscriptionPlan, SubscriptionPlanDTO> {

    @Override
    public SubscriptionPlanDTO apply(SubscriptionPlan plan) {
        return new SubscriptionPlanDTO(
                plan.getId(),
                plan.getPlanName(),
                plan.getPrice(),
                plan.getInterval(),
                plan.getDescription()
        );
    }
}
