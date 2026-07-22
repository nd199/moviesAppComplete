package com.naren.moviesapp.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.Objects;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "notification")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "notification_title")
    private String title;

    @Column(name = "message")
    private String message;

    @Column(name = "notification_category")
    private String category;

    @Column(name = "notification_type")
    private String messageType;

    @Column(name = "is_read")
    private boolean read = false;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Notification that = (Notification) o;
        return read == that.read && Objects.equals(id, that.id)
                && Objects.equals(customer, that.customer) && Objects.equals(title, that.title)
                && Objects.equals(message, that.message) && Objects.equals(category, that.category)
                && Objects.equals(messageType, that.messageType) &&
                Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customer, title, message, category, messageType, read, createdAt);
    }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", customer=" + customer +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", category='" + category + '\'' +
                ", messageType='" + messageType + '\'' +
                ", read=" + read +
                ", createdAt=" + createdAt +
                '}';
    }
}