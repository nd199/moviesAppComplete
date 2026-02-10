package com.naren.moviesapp.Repo;

import com.naren.moviesapp.AbstractTestContainers;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Payment;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.TestConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class PaymentRepositoryTest extends AbstractTestContainers {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SubscriptionPlanRepository subscriptionPlanRepository;

    private Customer customer;
    private SubscriptionPlan plan;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setName("Test User");
        customer.setEmail("pay.repo.user@codeNaren.com");
        customer.setPassword("password");
        customer.setPhoneNumber(9999999999L);
        customer.setImageUrl("");
        customer.setIsEmailVerified(true);
        customer.setAddress("Chennai, India");
        customer.setIsLogged(false);
        customer.setIsRegistered(true);
        customer.setIsSubscribed(false);
        customer = customerRepository.save(customer);

        plan = new SubscriptionPlan();
        plan.setPlanName("Basic");
        plan.setPrice(99.99);
        plan.setInterval("monthly");
        plan.setDescription("basic plan");
        plan = subscriptionPlanRepository.save(plan);
    }

    @Test
    void findByTransactionId() {
        Payment payment = new Payment();
        payment.setCustomer(customer);
        payment.setPlan(plan);
        payment.setPaymentMethod("credit_card");
        payment.setTransactionId("tx-123");
        payment.setAmount(99.99);
        payment.setStatus("COMPLETED");
        paymentRepository.save(payment);

        var found = paymentRepository.findByTransactionId("tx-123");

        assertThat(found).isPresent();
        assertThat(found.orElseThrow().getTransactionId()).isEqualTo("tx-123");
    }

    @Test
    void findByCustomerEmail_and_findLatestPaymentByEmail() {
        Payment oldPayment = new Payment();
        oldPayment.setCustomer(customer);
        oldPayment.setPlan(plan);
        oldPayment.setPaymentMethod("credit_card");
        oldPayment.setTransactionId("tx-old");
        oldPayment.setAmount(99.99);
        oldPayment.setStatus("COMPLETED");
        paymentRepository.save(oldPayment);

        Payment newPayment = new Payment();
        newPayment.setCustomer(customer);
        newPayment.setPlan(plan);
        newPayment.setPaymentMethod("upi");
        newPayment.setTransactionId("tx-new");
        newPayment.setAmount(99.99);
        newPayment.setStatus("COMPLETED");
        paymentRepository.save(newPayment);

        List<Payment> byEmail = paymentRepository.findByCustomerEmail(customer.getEmail());
        assertThat(byEmail).extracting(Payment::getTransactionId)
                .contains("tx-old", "tx-new");

        var latest = paymentRepository.findFirstByCustomerEmailOrderByCreatedAtDesc(customer.getEmail());
        assertThat(latest).isPresent();
        assertThat(latest.orElseThrow().getTransactionId()).isEqualTo("tx-new");
    }
}
