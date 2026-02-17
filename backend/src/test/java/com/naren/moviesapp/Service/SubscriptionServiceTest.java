package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.IntentStatus;
import com.naren.moviesapp.Entity.SubscriptionIntent;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.SubscriptionIntentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionIntentRepository subscriptionIntentRepository;

    private SubscriptionService underTest;

    @BeforeEach
    void setUp() {
        underTest = new SubscriptionService(subscriptionIntentRepository);
    }

    @Test
    void generatePaymentToken_Success() {
        Long userId = 1L;
        Long planId = 2L;

        when(subscriptionIntentRepository.existsByUserIdAndPlanId(userId, planId)).thenReturn(false);

        String result = underTest.generatePaymentToken(userId, planId);

        assertThat(result).isNotNull();
        assertThat(result).isNotEmpty();

        ArgumentCaptor<SubscriptionIntent> intentCaptor = ArgumentCaptor.forClass(SubscriptionIntent.class);
        verify(subscriptionIntentRepository).save(intentCaptor.capture());

        SubscriptionIntent capturedIntent = intentCaptor.getValue();
        assertThat(capturedIntent.getUserId()).isEqualTo(userId);
        assertThat(capturedIntent.getPlanId()).isEqualTo(planId);
        assertThat(capturedIntent.getStatus()).isEqualTo(IntentStatus.PENDING);
        assertThat(capturedIntent.getIntentToken()).isEqualTo(result);
        assertThat(capturedIntent.getCreatedAt()).isNotNull();
        assertThat(capturedIntent.getLastUpdated()).isNotNull();
    }

    @Test
    void generatePaymentToken_AlreadySubscribed() {
        Long userId = 1L;
        Long planId = 2L;

        when(subscriptionIntentRepository.existsByUserIdAndPlanId(userId, planId)).thenReturn(true);

        assertThatThrownBy(() -> underTest.generatePaymentToken(userId, planId))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("User already subscribed to this plan");

        verify(subscriptionIntentRepository, never()).save(any());
    }

    @Test
    void updateIntentStatus_Success() {
        String intentToken = UUID.randomUUID().toString();
        IntentStatus newStatus = IntentStatus.COMPLETED;

        SubscriptionIntent existingIntent = new SubscriptionIntent();
        existingIntent.setIntentToken(intentToken);
        existingIntent.setStatus(IntentStatus.PENDING);
        existingIntent.setCreatedAt(LocalDateTime.now().minusDays(1));
        existingIntent.setLastUpdated(LocalDateTime.now().minusDays(1));

        when(subscriptionIntentRepository.findByIntentToken(intentToken))
                .thenReturn(Optional.of(existingIntent));

        underTest.updateIntentStatus(intentToken, newStatus);

        ArgumentCaptor<SubscriptionIntent> intentCaptor = ArgumentCaptor.forClass(SubscriptionIntent.class);
        verify(subscriptionIntentRepository).save(intentCaptor.capture());

        SubscriptionIntent capturedIntent = intentCaptor.getValue();
        assertThat(capturedIntent.getStatus()).isEqualTo(newStatus);
        assertThat(capturedIntent.getLastUpdated()).isAfterOrEqualTo(existingIntent.getLastUpdated());
    }

    @Test
    void updateIntentStatus_SameStatus() {
        String intentToken = UUID.randomUUID().toString();
        IntentStatus currentStatus = IntentStatus.PENDING;

        SubscriptionIntent existingIntent = new SubscriptionIntent();
        existingIntent.setIntentToken(intentToken);
        existingIntent.setStatus(currentStatus);
        existingIntent.setCreatedAt(LocalDateTime.now().minusDays(1));
        existingIntent.setLastUpdated(LocalDateTime.now().minusDays(1));

        when(subscriptionIntentRepository.findByIntentToken(intentToken))
                .thenReturn(Optional.of(existingIntent));

        underTest.updateIntentStatus(intentToken, currentStatus);

        verify(subscriptionIntentRepository).save(existingIntent);
        assertThat(existingIntent.getStatus()).isEqualTo(currentStatus);
    }

    @Test
    void updateIntentStatus_InvalidToken() {
        String intentToken = UUID.randomUUID().toString();
        IntentStatus newStatus = IntentStatus.COMPLETED;

        when(subscriptionIntentRepository.findByIntentToken(intentToken))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.updateIntentStatus(intentToken, newStatus))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid intent token");

        verify(subscriptionIntentRepository, never()).save(any());
    }

    @Test
    void findByIntentToken_Success() {
        String intentToken = UUID.randomUUID().toString();
        SubscriptionIntent expectedIntent = new SubscriptionIntent();
        expectedIntent.setIntentToken(intentToken);

        when(subscriptionIntentRepository.findByIntentToken(intentToken))
                .thenReturn(Optional.of(expectedIntent));

        SubscriptionIntent result = underTest.findByIntentToken(intentToken);

        assertThat(result).isEqualTo(expectedIntent);
        verify(subscriptionIntentRepository).findByIntentToken(intentToken);
    }

    @Test
    void findByIntentToken_NotFound() {
        String intentToken = UUID.randomUUID().toString();

        when(subscriptionIntentRepository.findByIntentToken(intentToken))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.findByIntentToken(intentToken))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid intent token");

        verify(subscriptionIntentRepository).findByIntentToken(intentToken);
    }

    @Test
    void findByUserId_Success() {
        Long userId = 1L;
        SubscriptionIntent expectedIntent = new SubscriptionIntent();
        expectedIntent.setUserId(userId);

        when(subscriptionIntentRepository.findByUserId(userId))
                .thenReturn(Optional.of(expectedIntent));

        SubscriptionIntent result = underTest.findByUserId(userId);

        assertThat(result).isEqualTo(expectedIntent);
        verify(subscriptionIntentRepository).findByUserId(userId);
    }

    @Test
    void findByUserId_NotFound() {
        Long userId = 999L;

        when(subscriptionIntentRepository.findByUserId(userId))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.findByUserId(userId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid user id");

        verify(subscriptionIntentRepository).findByUserId(userId);
    }
}
