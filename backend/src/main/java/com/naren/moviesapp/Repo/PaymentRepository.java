package com.naren.moviesapp.Repo;

import com.naren.moviesapp.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByTransactionId(String transactionId);

    List<Payment> findByCustomerId(Long customerId);

    @Query("SELECT p FROM Payment p WHERE p.customer.email = :email")
    List<Payment> findByCustomerEmail(@Param("email") String email);

    Optional<Payment> findFirstByCustomerEmailOrderByCreatedAtDesc(String email);
}
