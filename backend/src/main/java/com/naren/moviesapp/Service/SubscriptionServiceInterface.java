package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.IntentStatus;
import com.naren.moviesapp.Entity.SubscriptionIntent;

public interface SubscriptionServiceInterface {
    String generatePaymentToken(Long userId, Long planId);

    void updateIntentStatus(String intentToken, IntentStatus status);

    SubscriptionIntent findByIntentToken(String intentToken);

    SubscriptionIntent findByUserId(Long userId);
}
