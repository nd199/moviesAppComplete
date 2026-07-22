package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Notification;
import com.naren.moviesapp.Repo.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public List<Notification> getNotifications(Long customerId) {
        return notificationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public long getUnreadCount(Long customerId) {
        return notificationRepository.countByCustomerIdAndReadFalse(customerId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsRead(Long customerId) {
        List<Notification> unread = notificationRepository.findByCustomerIdAndReadFalse(customerId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Transactional
    public Notification createNotification(Customer customer, String title, String message, String category, String messageType) {
        Notification notification = Notification.builder()
                .customer(customer)
                .title(title)
                .message(message)
                .category(category)
                .messageType(messageType)
                .read(false)
                .build();
        return notificationRepository.save(notification);
    }
}
