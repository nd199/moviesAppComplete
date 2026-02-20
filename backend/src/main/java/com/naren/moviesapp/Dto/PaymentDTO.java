package com.naren.moviesapp.Dto;

import java.time.LocalDateTime;

public record PaymentDTO(
        Long id,
        String transactionId,
        Double amount,
        String paymentMethod,
        String status,
        Long customerId,
        Long planId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
