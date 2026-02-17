package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractTestContainers;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Payment;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.TestData.TestDataFactory;
import com.naren.moviesapp.TestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
@ActiveProfiles("test")
public class PaymentRepositoryTest extends AbstractTestContainers {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Test
    void findByTransactionId() {
        // Create unique test data
        String uniqueId = UUID.randomUUID().toString();

        Customer customer = new Customer();
        customer.setName("Test User");
        customer.setEmail("test-" + uniqueId + "@example.com");
        customer.setPassword("password123");
        customer.setPhoneNumber("9" + UUID.randomUUID().toString().substring(0, 9));
        customer.setImageUrl("");
        customer.setIsEmailVerified(true);
        customer.setAddress("Chennai, India");
        customer.setIsLogged(false);
        customer.setIsRegistered(true);
        customer.setIsSubscribed(false);
        customer = customerRepository.save(customer);

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setPlanName("Test Plan " + uniqueId);
        plan.setPrice(100.0);
        plan.setInterval("monthly");
        plan.setDescription("Test plan");
        plan = subscriptionPlanRepository.save(plan);

        Payment payment = new Payment();
        payment.setCustomer(customer);
        payment.setPlan(plan);
        payment.setAmount(100.0);
        payment.setTransactionId("txn_" + uniqueId);
        payment.setPaymentMethod("CREDIT_CARD");
        payment.setStatus("SUCCESS");
        payment.setCreatedAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        var actual = paymentRepository.findByTransactionId("txn_" + uniqueId);
        assertThat(actual).isPresent();
        assertThat(actual.get().getTransactionId()).isEqualTo("txn_" + uniqueId);
    }
}
