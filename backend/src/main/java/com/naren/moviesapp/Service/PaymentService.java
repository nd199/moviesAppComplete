package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Payment;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Entity.UserPlanInfo;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.PaymentRepository;
import com.naren.moviesapp.Repo.SubscriptionPlanRepository;
import com.naren.moviesapp.Repo.UserPlanInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserPlanInfoRepository userPlanInfoRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Transactional
    public Payment processPayment(String email, Long planId, String paymentMethod) {
        try {
            Customer customer = customerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));

            SubscriptionPlan plan = subscriptionPlanRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Subscription plan not found with id: " + planId));

            Payment payment = new Payment();
            payment.setCustomer(customer);
            payment.setPlan(plan);
            payment.setPaymentMethod(paymentMethod);
            payment.setTransactionId(UUID.randomUUID().toString());
            payment.setAmount(plan.getPrice());
            payment.setStatus("COMPLETED");

            Payment savedPayment = paymentRepository.save(payment);

            updateUserPlanInfo(customer, plan);

            customer.setIsSubscribed(true);
            customerRepository.save(customer);

            return savedPayment;

        } catch (Exception e) {
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }
    }

    @Transactional
    public UserPlanInfo updateUserPlan(Customer customer, SubscriptionPlan plan) {
        Optional<UserPlanInfo> existingPlanInfo = userPlanInfoRepository.findByCustomerId(customer.getId());

        UserPlanInfo planInfo;
        if (existingPlanInfo.isPresent()) {
            planInfo = existingPlanInfo.get();
            planInfo.setSelectedPlan(plan);
            planInfo.setIsActive(true);
            planInfo.setSubscriptionStartDate(LocalDateTime.now());

            if ("monthly".equalsIgnoreCase(plan.getInterval())) {
                planInfo.setSubscriptionEndDate(LocalDateTime.now().plusMonths(1));
            } else if ("yearly".equalsIgnoreCase(plan.getInterval())) {
                planInfo.setSubscriptionEndDate(LocalDateTime.now().plusYears(1));
            }
        } else {
            planInfo = new UserPlanInfo();
            planInfo.setCustomer(customer);
            planInfo.setSelectedPlan(plan);
            planInfo.setIsActive(true);
            planInfo.setSubscriptionStartDate(LocalDateTime.now());

            if ("monthly".equalsIgnoreCase(plan.getInterval())) {
                planInfo.setSubscriptionEndDate(LocalDateTime.now().plusMonths(1));
            } else if ("yearly".equalsIgnoreCase(plan.getInterval())) {
                planInfo.setSubscriptionEndDate(LocalDateTime.now().plusYears(1));
            }
        }

        return userPlanInfoRepository.save(planInfo);
    }

    private void updateUserPlanInfo(Customer customer, SubscriptionPlan plan) {
        updateUserPlan(customer, plan);
    }

    public Optional<Payment> getLatestPaymentByEmail(String email) {
        return paymentRepository.findFirstByCustomerEmailOrderByCreatedAtDesc(email);
    }

    public List<Payment> getPaymentsByEmail(String email) {
        return paymentRepository.findByCustomerEmail(email);
    }

    public Optional<UserPlanInfo> getUserPlanInfo(String email) {
        return userPlanInfoRepository.findByCustomerEmail(email);
    }

    public Optional<UserPlanInfo> getActiveUserPlan(String email) {
        return userPlanInfoRepository.findActivePlanByEmail(email);
    }

    @Transactional
    public Customer updateSubscriptionStatus(String email, boolean isSubscribed) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));

        customer.setIsSubscribed(isSubscribed);

        Optional<UserPlanInfo> planInfo = userPlanInfoRepository.findByCustomerId(customer.getId());
        if (planInfo.isPresent()) {
            UserPlanInfo userPlan = planInfo.get();
            if (isSubscribed) {
                userPlan.setIsActive(true);
                if (userPlan.getSubscriptionEndDate() == null || userPlan.getSubscriptionEndDate().isBefore(LocalDateTime.now())) {
                    userPlan.setSubscriptionEndDate(LocalDateTime.now().plusMonths(1));
                }
            } else {
                userPlan.setIsActive(false);
            }
            userPlanInfoRepository.save(userPlan);
        }

        return customerRepository.save(customer);
    }
}
