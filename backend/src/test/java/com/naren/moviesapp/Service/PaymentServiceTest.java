package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Payment;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Entity.UserPlanInfo;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.PaymentRepository;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import com.naren.moviesapp.Repo.UserPlanInfoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserPlanInfoRepository userPlanInfoRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Captor
    private ArgumentCaptor<Payment> paymentArgumentCaptor;

    private PaymentService underTest;

    @BeforeEach
    void setUp() {
        underTest = new PaymentService(
                paymentRepository,
                userPlanInfoRepository,
                customerRepository,
                subscriptionPlanRepository
        );
    }

    @Test
    void processPayment_savesPayment_updatesPlanInfo_and_marksCustomerSubscribed() {
        String email = "user@example.com";
        Long planId = 1L;
        String paymentMethod = "credit_card";

        Customer customer = new Customer();
        customer.setId(10L);
        customer.setEmail(email);
        customer.setIsSubscribed(false);

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(planId);
        plan.setPrice(99.99);
        plan.setInterval("monthly");

        Payment savedPayment = new Payment();
        savedPayment.setId(100L);

        when(customerRepository.findCustomerByEmail(email)).thenReturn(Optional.of(customer));
        when(subscriptionPlanRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(paymentRepository.save(any(Payment.class))).thenReturn(savedPayment);
        when(userPlanInfoRepository.findByCustomerId(customer.getId())).thenReturn(Optional.empty());
        when(userPlanInfoRepository.save(any(UserPlanInfo.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Payment result = underTest.processPayment(email, planId, paymentMethod);

        assertThat(result).isSameAs(savedPayment);

        verify(paymentRepository).save(paymentArgumentCaptor.capture());
        Payment capturedPayment = paymentArgumentCaptor.getValue();

        assertThat(capturedPayment.getCustomer()).isEqualTo(customer);
        assertThat(capturedPayment.getPlan()).isEqualTo(plan);
        assertThat(capturedPayment.getPaymentMethod()).isEqualTo(paymentMethod);
        assertThat(capturedPayment.getTransactionId()).isNotBlank();
        assertThat(capturedPayment.getAmount()).isEqualTo(plan.getPrice());
        assertThat(capturedPayment.getStatus()).isEqualTo("COMPLETED");

        verify(userPlanInfoRepository).save(any(UserPlanInfo.class));
        verify(customerRepository).save(customer);
        assertThat(customer.getIsSubscribed()).isTrue();
    }

    @Test
    void processPayment_throws_when_customer_not_found() {
        String email = "missing@example.com";

        when(customerRepository.findCustomerByEmail(email)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.processPayment(email, 1L, "credit_card"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Payment processing failed")
                .hasMessageContaining("Customer not found");

        verify(paymentRepository, never()).save(any());
        verify(userPlanInfoRepository, never()).save(any());
    }

    @Test
    void processPayment_throws_when_plan_not_found() {
        String email = "user@example.com";

        Customer customer = new Customer();
        customer.setId(10L);
        customer.setEmail(email);

        when(customerRepository.findCustomerByEmail(email)).thenReturn(Optional.of(customer));
        when(subscriptionPlanRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.processPayment(email, 99L, "credit_card"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Payment processing failed")
                .hasMessageContaining("Subscription plan not found");

        verify(paymentRepository, never()).save(any());
        verify(userPlanInfoRepository, never()).save(any());
    }
}
