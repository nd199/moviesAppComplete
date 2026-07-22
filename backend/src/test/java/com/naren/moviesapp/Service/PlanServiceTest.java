package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PlanServiceTest {

    @Mock
    private SubscriptionPlanRepository planRepository;

    private PlanService underTest;

    @BeforeEach
    void setUp() {
        underTest = new PlanService(planRepository);
    }

    @Test
    void findById_Success() {
        Long planId = 1L;
        SubscriptionPlan expectedPlan = new SubscriptionPlan();
        expectedPlan.setId(planId);
        expectedPlan.setPlanName("Premium Plan");

        when(planRepository.findById(planId)).thenReturn(Optional.of(expectedPlan));

        SubscriptionPlan result = underTest.findById(planId);

        assertThat(result).isEqualTo(expectedPlan);
        verify(planRepository).findById(planId);
    }

    @Test
    void findById_NotFound() {
        Long planId = 999L;

        when(planRepository.findById(planId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.findById(planId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Plan Not Found with id : " + planId);

        verify(planRepository).findById(planId);
    }
}
