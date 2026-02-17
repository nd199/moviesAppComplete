package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionPlanServiceTest {

    @Mock
    private SubscriptionPlanRepository planRepository;

    private SubscriptionPlanService underTest;

    @BeforeEach
    void setUp() {
        underTest = new SubscriptionPlanService(planRepository);
    }

    @Test
    void getPlan_Success() {
        Long planId = 1L;
        SubscriptionPlan expectedPlan = new SubscriptionPlan();
        expectedPlan.setId(planId);
        expectedPlan.setPlanName("Premium Plan");

        when(planRepository.findById(planId)).thenReturn(Optional.of(expectedPlan));

        SubscriptionPlan result = underTest.getPlan(planId);

        assertThat(result).isEqualTo(expectedPlan);
        verify(planRepository).findById(planId);
    }

    @Test
    void getPlan_NotFound() {
        Long planId = 999L;

        when(planRepository.findById(planId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.getPlan(planId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Plan not found");

        verify(planRepository).findById(planId);
    }

    @Test
    void getAllPlans_Success() {
        SubscriptionPlan plan1 = new SubscriptionPlan();
        plan1.setId(1L);
        plan1.setPlanName("Basic Plan");

        SubscriptionPlan plan2 = new SubscriptionPlan();
        plan2.setId(2L);
        plan2.setPlanName("Premium Plan");

        SubscriptionPlan plan3 = new SubscriptionPlan();
        plan3.setId(3L);
        plan3.setPlanName("Enterprise Plan");

        List<SubscriptionPlan> expectedPlans = Arrays.asList(plan1, plan2, plan3);

        when(planRepository.findAll()).thenReturn(expectedPlans);

        List<SubscriptionPlan> result = underTest.getAllPlans();

        assertThat(result).isEqualTo(expectedPlans);
        assertThat(result).hasSize(3);
        verify(planRepository).findAll();
    }

    @Test
    void getAllPlans_EmptyList() {
        List<SubscriptionPlan> expectedPlans = Arrays.asList();

        when(planRepository.findAll()).thenReturn(expectedPlans);

        List<SubscriptionPlan> result = underTest.getAllPlans();

        assertThat(result).isEqualTo(expectedPlans);
        assertThat(result).isEmpty();
        verify(planRepository).findAll();
    }
}
