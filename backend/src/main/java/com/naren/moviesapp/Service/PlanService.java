package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
public class PlanService implements PlanServiceInterface {

    public SubscriptionPlanRepository planRepository;

    @Override
    @PreAuthorize("hasPermission('USER_READ')")
    public SubscriptionPlan findById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Plan Not Found with id : " + id));
    }
}
