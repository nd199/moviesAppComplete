package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Payment;
import com.naren.moviesapp.Entity.UserPlanInfo;
import com.naren.moviesapp.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    @PostMapping("/submitPayment")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> submitPayment(@RequestBody Map<String, Object> requestBody) {
        logger.info("Submit payment request received");
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> finalPayment = (Map<String, Object>) requestBody.get("finalPayment");
            @SuppressWarnings("unchecked")
            Map<String, Object> finalUser = (Map<String, Object>) finalPayment.get("finalUser");
            @SuppressWarnings("unchecked")
            Map<String, Object> finalPlan = (Map<String, Object>) finalPayment.get("finalPlan");

            String email = (String) finalUser.get("email");
            Long planId = Long.valueOf(((Integer) finalPlan.get("id")).toString());
            String paymentMethod = (String) finalPayment.get("paymentMethod");

            Payment payment = paymentService.processPayment(email, planId, paymentMethod);

            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Payment processed successfully",
                    "data", payment
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.<String, Object>of(
                    "message", "Failed to save payment: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/api/auth/payment")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> requestBody) {
        logger.info("Process payment request received");
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> currentUser = (Map<String, Object>) requestBody.get("currentUser");
            @SuppressWarnings("unchecked")
            Map<String, Object> selectedPlan = (Map<String, Object>) requestBody.get("selectedPlan");

            String email = (String) currentUser.get("email");
            Long planId = Long.valueOf(selectedPlan.get("id").toString());

            logger.debug("Processing payment for user: {} with plan: {}", email, planId);

            Payment payment = paymentService.processPayment(email, planId, "credit_card");

            Optional<UserPlanInfo> userPlanInfo = paymentService.getUserPlanInfo(email);

            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Payment processed",
                    "data", userPlanInfo.orElse(null)
            ));

        } catch (Exception e) {
            logger.error("Payment failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Payment failed: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/paymentDetails")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<Object> getPaymentDetails(@RequestParam String email) {
        logger.debug("Fetching payment details for email: {}", email);
        try {
            Optional<UserPlanInfo> userPlanInfo = paymentService.getUserPlanInfo(email);

            if (userPlanInfo.isEmpty()) {
                logger.warn("Payment details not found for email: {}", email);
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Payment details",
                    "data", userPlanInfo.get()
            ));

        } catch (Exception e) {
            logger.error("Failed to fetch payment details: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to fetch details: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/updateFinalUser")
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public ResponseEntity<?> updateFinalUser(@RequestBody Map<String, Object> requestBody) {
        logger.info("Update final user subscription request received");
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> finalUser = (Map<String, Object>) requestBody.get("finalUser");
            String email = (String) finalUser.get("email");
            Boolean isSubscribed = (Boolean) finalUser.get("isSubscribed");

            logger.debug("Updating subscription status for email: {} to {}", email, isSubscribed);

            var customer = paymentService.updateSubscriptionStatus(email, isSubscribed);
            Optional<Payment> payment = paymentService.getLatestPaymentByEmail(email);

            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "User subscription updated",
                    "data", payment.orElse(null)
            ));

        } catch (Exception e) {
            logger.error("Failed to update user subscription: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/api/payment/intent")
    public ResponseEntity<?> getPaymentIntent(@RequestParam String token) {
        logger.debug("Getting payment intent with token");
        try {
            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Payment intent retrieved",
                    "token", token
            ));
        } catch (Exception e) {
            logger.warn("Invalid or expired payment intent token");
            return ResponseEntity.badRequest().body(Map.<String, Object>of(
                    "message", "Invalid or expired token"
            ));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<?> getPaymentHistory(@RequestParam String email) {
        logger.debug("Fetching payment history for email: {}", email);
        try {
            List<Payment> payments = paymentService.getPaymentsByEmail(email);
            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Payment history",
                    "data", payments
            ));
        } catch (Exception e) {
            logger.error("Failed to fetch payment history: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to fetch payment history: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/subscribe-success")
    public ResponseEntity<?> markUserSubscribed(Authentication authentication) {
        logger.info("Mark user subscribed request for authenticated user");
        try {
            String email = authentication.getName();
            var updatedCustomer = paymentService.updateSubscriptionStatus(email, true);
            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "User subscription updated successfully",
                    "data", Map.<String, Object>of(
                            "id", updatedCustomer.getId(),
                            "email", updatedCustomer.getEmail(),
                            "name", updatedCustomer.getName(),
                            "isSubscribed", updatedCustomer.getIsSubscribed(),
                            "phoneNumber", updatedCustomer.getPhoneNumber(),
                            "address", updatedCustomer.getAddress(),
                            "isEmailVerified", updatedCustomer.getIsEmailVerified()
                    )
            ));
        } catch (Exception e) {
            logger.error("Failed to update subscription: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to update subscription: " + e.getMessage()
            ));
        }
    }
}
