package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.IntentStatus;
import com.naren.moviesapp.Entity.SubscriptionIntent;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.SubscriptionIntentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
public class SubscriptionService implements SubscriptionServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionService.class);

    private final SubscriptionIntentRepository subscriptionIntentRepository;

    public SubscriptionService(SubscriptionIntentRepository subscriptionIntentRepository) {
        this.subscriptionIntentRepository = subscriptionIntentRepository;
    }

    @Override
    public String generatePaymentToken(Long userId, Long planId) {
        logger.info("Generating payment token for userId: {}, planId: {}", userId, planId);
        if (subscriptionIntentRepository.existsByUserIdAndPlanId(userId, planId)) {
            logger.warn("User {} already subscribed to plan {}", userId, planId);
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
        logger.info("Payment token generated successfully: {}", intent.getIntentToken());
        return intent.getIntentToken();
    }

    @Override
    public void updateIntentStatus(String intentToken, IntentStatus status) {
        logger.info("Updating intent status for token: {}, new status: {}", intentToken, status);
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
        logger.info("Intent status updated successfully");
    }

    @Override
    public SubscriptionIntent findByIntentToken(String intentToken) {
        logger.debug("Finding intent by token: {}", intentToken);
        return subscriptionIntentRepository.findByIntentToken(intentToken)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid intent token"));
    }

    @Override
    public SubscriptionIntent findByUserId(Long userId) {
        logger.debug("Finding intent by userId: {}", userId);
        return subscriptionIntentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid user id"));
    }
}
