package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.IntentStatus;
import com.naren.moviesapp.Entity.SubscriptionIntent;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.SubscriptionIntentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
public class SubscriptionService implements SubscriptionServiceInterface {

    private final SubscriptionIntentRepository subscriptionIntentRepository;

    public SubscriptionService(SubscriptionIntentRepository subscriptionIntentRepository) {
        this.subscriptionIntentRepository = subscriptionIntentRepository;
    }

    @Override
    public String generatePaymentToken(Long userId, Long planId) {
        if (subscriptionIntentRepository.existsByUserIdAndPlanId(userId, planId)) {
            throw new ResourceAlreadyExists("User already subscribed to this plan");
        }
        SubscriptionIntent intent =
                SubscriptionIntent.builder()
                        .userId(userId)
                        .planId(planId)
                        .status(IntentStatus.PENDING)
                        .intentToken(UUID.randomUUID().toString())
                        .createdAt(LocalDateTime.now())
                        .lastUpdated(LocalDateTime.now()).build();
        subscriptionIntentRepository.save(intent);
        return intent.getIntentToken();
    }

    @Override
    public void updateIntentStatus(String intentToken, IntentStatus status) {
        SubscriptionIntent intent = subscriptionIntentRepository.findByIntentToken(intentToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid intent token"));
        if (intent == null) {
            throw new ResourceNotFoundException("Invalid intent token");
        }
        if (Objects.nonNull(intent.getStatus()) && !intent.getStatus().equals(status)) {
            intent.setStatus(status);
        }
        intent.setLastUpdated(LocalDateTime.now());
        subscriptionIntentRepository.save(intent);
    }

    @Override
    public SubscriptionIntent findByIntentToken(String intentToken) {
        return subscriptionIntentRepository.findByIntentToken(intentToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid intent token"));
    }

    @Override
    public SubscriptionIntent findByUserId(Long userId) {
        return subscriptionIntentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid user id"));
    }

}
