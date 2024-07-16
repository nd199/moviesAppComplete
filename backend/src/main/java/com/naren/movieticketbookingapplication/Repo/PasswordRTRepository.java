package com.naren.movieticketbookingapplication.Repo;

import com.naren.movieticketbookingapplication.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PasswordRTRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    void deleteByEmail(String email);
}
