package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Notification;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;
    private final CustomerRepository customerRepository;

    @GetMapping
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        try {
            Customer customer = getCustomer(authentication);
            List<Notification> notifications = notificationService.getNotifications(customer.getId());
            long unreadCount = notificationService.getUnreadCount(customer.getId());
            return ResponseEntity.ok(Map.<String, Object>of(
                    "data", notifications,
                    "unreadCount", unreadCount
            ));
        } catch (Exception e) {
            logger.error("Failed to fetch notifications: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to fetch notifications"
            ));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        try {
            Customer customer = getCustomer(authentication);
            long count = notificationService.getUnreadCount(customer.getId());
            return ResponseEntity.ok(Map.<String, Object>of(
                    "unreadCount", count
            ));
        } catch (Exception e) {
            logger.error("Failed to fetch unread count: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to fetch unread count"
            ));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Notification marked as read",
                    "data", notification
            ));
        } catch (Exception e) {
            logger.error("Failed to mark notification as read: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to mark notification as read"
            ));
        }
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        try {
            Customer customer = getCustomer(authentication);
            notificationService.markAllAsRead(customer.getId());
            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "All notifications marked as read"
            ));
        } catch (Exception e) {
            logger.error("Failed to mark all notifications as read: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to mark all as read"
            ));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok(Map.<String, Object>of(
                    "message", "Notification deleted"
            ));
        } catch (Exception e) {
            logger.error("Failed to delete notification: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.<String, Object>of(
                    "message", "Failed to delete notification"
            ));
        }
    }

    private Customer getCustomer(Authentication authentication) {
        String email = authentication.getName();
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found with email: " + email));
    }
}
