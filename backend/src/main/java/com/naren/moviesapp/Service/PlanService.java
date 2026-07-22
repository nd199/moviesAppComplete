package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PlanService implements PlanServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(PlanService.class);

    private final SubscriptionPlanRepository planRepository;

    public PlanService(SubscriptionPlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public SubscriptionPlan findById(Long id) {
        logger.debug("Finding plan by ID: {}", id);
        return planRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Plan Not Found with id : " + id));
    }
}
