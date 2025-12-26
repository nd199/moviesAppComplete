package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.IntentStatus;
import com.naren.movieticketbookingapplication.Entity.SubscriptionIntent;

public interface SubscriptionService {
    String generatePaymentToken(Long userId, Long planId);

    void updateIntentStatus(String intentToken, IntentStatus status);

    SubscriptionIntent findByIntentToken(String intentToken);

    SubscriptionIntent findByUserId(Long userId);
}
