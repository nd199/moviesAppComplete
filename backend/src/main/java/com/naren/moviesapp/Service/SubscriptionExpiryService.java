package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.UserPlanInfo;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.UserPlanInfoRepository;
import com.naren.moviesapp.Utils.EmailService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionExpiryService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionExpiryService.class);

    private final UserPlanInfoRepository userPlanInfoRepository;
    private final CustomerRepository customerRepository;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkExpiredSubscriptions() {
        logger.info("Running scheduled task: checkExpiredSubscriptions");

        List<UserPlanInfo> expiredSubscriptions = userPlanInfoRepository.findExpiredSubscriptions();
        logger.info("Found {} expired subscriptions", expiredSubscriptions.size());

        for (UserPlanInfo planInfo : expiredSubscriptions) {
            try {
                Customer customer = planInfo.getCustomer();
                String planName = planInfo.getSelectedPlan() != null ? planInfo.getSelectedPlan().getPlanName() : "Premium";

                planInfo.setIsActive(false);
                userPlanInfoRepository.save(planInfo);

                customer.setIsSubscribed(false);
                customerRepository.save(customer);

                notificationService.createNotification(
                        customer,
                        "Subscription Expired",
                        "Your " + planName + " subscription has expired. Resubscribe to continue watching.",
                        "SUBSCRIPTION",
                        "EXPIRY"
                );

                try {
                    emailService.sendSubscriptionExpiredEmail(customer.getEmail(), planName);
                } catch (Exception e) {
                    logger.error("Failed to send expired email to {}: {}", customer.getEmail(), e.getMessage());
                }

                logger.info("Deactivated expired subscription for customer: {}", customer.getEmail());
            } catch (Exception e) {
                logger.error("Error processing expired subscription: {}", e.getMessage(), e);
            }
        }
    }

    @Scheduled(cron = "0 0 10 * * *")
    @Transactional
    public void checkExpiringSoonSubscriptions() {
        logger.info("Running scheduled task: checkExpiringSoonSubscriptions");

        List<UserPlanInfo> expiringSubscriptions = userPlanInfoRepository.findSubscriptionsExpiringSoonBefore(LocalDateTime.now().plusDays(3));
        logger.info("Found {} subscriptions expiring soon", expiringSubscriptions.size());

        for (UserPlanInfo planInfo : expiringSubscriptions) {
            try {
                Customer customer = planInfo.getCustomer();
                String planName = planInfo.getSelectedPlan() != null ? planInfo.getSelectedPlan().getPlanName() : "Premium";
                long daysRemaining = ChronoUnit.DAYS.between(LocalDateTime.now(), planInfo.getSubscriptionEndDate());

                if (daysRemaining <= 0) {
                    continue;
                }

                notificationService.createNotification(
                        customer,
                        "Subscription Expiring Soon",
                        "Your " + planName + " subscription expires in " + daysRemaining + " day(s). Renew now to keep watching.",
                        "SUBSCRIPTION",
                        "EXPIRY_WARNING"
                );

                try {
                    emailService.sendSubscriptionExpiryWarningEmail(customer.getEmail(), planName, daysRemaining);
                } catch (Exception e) {
                    logger.error("Failed to send expiry warning email to {}: {}", customer.getEmail(), e.getMessage());
                }

                logger.info("Sent expiry warning to customer: {} ({} days remaining)", customer.getEmail(), daysRemaining);
            } catch (Exception e) {
                logger.error("Error processing expiring subscription: {}", e.getMessage(), e);
            }
        }
    }
}
