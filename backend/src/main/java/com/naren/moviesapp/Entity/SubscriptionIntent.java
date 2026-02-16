package com.naren.moviesapp.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "subscription_intents")
public class SubscriptionIntent {
    @Id
    @GeneratedValue
    private Long id;
    private Long userId;
    private Long planId;
    @Enumerated(EnumType.STRING)
    private IntentStatus status;
    private String intentToken;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.lastUpdated = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SubscriptionIntent intent = (SubscriptionIntent) o;
        return Objects.equals(id, intent.id) && Objects.equals(userId, intent.userId) && Objects.equals(planId, intent.planId) && status == intent.status && Objects.equals(intentToken, intent.intentToken) && Objects.equals(createdAt, intent.createdAt) && Objects.equals(lastUpdated, intent.lastUpdated);
    }

    public int hashCode() {
        return Objects.hash(id, userId, planId, status, intentToken, createdAt, lastUpdated);
    }
}