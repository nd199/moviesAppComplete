package com.naren.moviesapp.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseUser {

    @Column(name = "name", columnDefinition = "TEXT")
    protected String name;

    @Column(name = "email", columnDefinition = "TEXT", nullable = false)
    protected String email;

    @Column(name = "password", columnDefinition = "TEXT", nullable = false)
    protected String password;

    @Column(name = "phone_number", nullable = false, columnDefinition = "TEXT")
    protected String phoneNumber;

    @Column(nullable = false)
    protected Boolean isEmailVerified = false;

    @Column(name = "is_active", nullable = false)
    protected Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    protected LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    protected LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
