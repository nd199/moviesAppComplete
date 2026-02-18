package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractRepositoryTest;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Payment;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.TestData.TestDataFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class PaymentRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Test
    void findByTransactionId() {
        // Create and save related entities first
        Customer customer = TestDataFactory.createTestCustomer();
        customerRepository.save(customer);

        SubscriptionPlan plan = TestDataFactory.createTestSubscriptionPlan();
        subscriptionPlanRepository.save(plan);

        Payment payment = TestDataFactory.createTestPayment(null, customer, plan);
        paymentRepository.save(payment);

        Payment found = paymentRepository.findByTransactionId(payment.getTransactionId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getTransactionId()).isEqualTo(payment.getTransactionId());
    }
}
