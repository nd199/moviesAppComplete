package com.naren.moviesapp.Dto;

import com.naren.moviesapp.Entity.Payment;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class PaymentDTOMapper implements Function<Payment, PaymentDTO> {

    @Override
    public PaymentDTO apply(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getTransactionId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getCustomer() != null ? payment.getCustomer().getId() : null,
                payment.getPlan() != null ? payment.getPlan().getId() : null,
                payment.getCreatedAt(),
                payment.getUpdatedAt()
        );
    }
}
