package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.SubscriptionIntent;
import com.naren.moviesapp.Entity.SubscriptionPlan;
import com.naren.moviesapp.Record.PaymentIntentRequest;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.PlanService;
import com.naren.moviesapp.Service.SubscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/subscription")
public class SubscriptionController {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionController.class);

    private final SubscriptionService subscriptionService;
    private final CustomerService customerService;
    private final PlanService planService;

    public SubscriptionController(SubscriptionService subscriptionService, CustomerService customerService, PlanService planService) {
        this.subscriptionService = subscriptionService;
        this.customerService = customerService;
        this.planService = planService;
    }

    @PostMapping("/intent/")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> createIntent(
            @Valid @RequestBody PaymentIntentRequest request,
            Authentication authentication
    ) {
        Customer customer = (Customer) authentication.getPrincipal();
        Long planId = request.planId();
        logger.info("Creating payment intent for customer: {} with plan: {}", customer.getEmail(), planId);
        String paymentToken = subscriptionService.generatePaymentToken(customer.getId(), planId);
        return ResponseEntity.ok(Map.<String, String>of("paymentToken", paymentToken));
    }

    @GetMapping("/intent/{token}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getIntent(@PathVariable String token) {
        logger.debug("Fetching subscription intent with token: {}", token);
        SubscriptionIntent intent =
                subscriptionService.findByIntentToken(token);
        CustomerDTO user =
                customerService.getCustomerById(intent.getUserId());

        SubscriptionPlan plan =
                planService.findById(intent.getPlanId());

        return ResponseEntity.ok(Map.<String, Object>of(
                "user", Map.<String, Object>of(
                        "name", user.name(),
                        "email", user.email(),
                        "phoneNumber", user.phoneNumber(),
                        "address", user.address()
                ),
                "plan", plan
        ));
    }
}
