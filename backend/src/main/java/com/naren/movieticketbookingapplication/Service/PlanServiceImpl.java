package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.SubscriptionPlan;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Repo.SubscriptionPlanRepository;
import org.springframework.stereotype.Service;

@Service
public class PlanServiceImpl implements PlanService{

    public SubscriptionPlanRepository planRepository;

    @Override
    public SubscriptionPlan findById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Plan Not Found with id : " + id));
    }
}
