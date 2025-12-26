package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.SubscriptionIntent;
import com.naren.movieticketbookingapplication.Entity.SubscriptionPlan;
import com.naren.movieticketbookingapplication.Record.PaymentIntentRequest;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import com.naren.movieticketbookingapplication.Service.PlanService;
import com.naren.movieticketbookingapplication.Service.SubscriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final CustomerService customerService;
    private final PlanService planService;

    public SubscriptionController(SubscriptionService subscriptionService, CustomerService customerService, PlanService planService) {
        this.subscriptionService = subscriptionService;
        this.customerService = customerService;
        this.planService = planService;
    }

    @PostMapping("/intent/")
    public ResponseEntity<?> createIntent(
            @RequestBody PaymentIntentRequest request,
            Authentication authentication
    ) {
        Customer customer = (Customer) authentication.getPrincipal();
        Long planId = request.planId();
        String paymentToken = subscriptionService.generatePaymentToken(customer.getId(), planId);
        return ResponseEntity.ok(Map.of("paymentToken", paymentToken));
    }

    @GetMapping("/intent/{token}")
    public ResponseEntity<?> getIntent(@PathVariable String token) {
        SubscriptionIntent intent =
                subscriptionService.findByIntentToken(token);
        CustomerDTO user =
                customerService.getCustomerById(intent.getUserId());

        SubscriptionPlan plan =
                planService.findById(intent.getPlanId());

        return ResponseEntity.ok(Map.of(
                "user", Map.of(
                        "name", user.name(),
                        "email", user.email(),
                        "phoneNumber", user.phoneNumber(),
                        "address", user.address()
                ),
                "plan", plan
        ));
    }
}