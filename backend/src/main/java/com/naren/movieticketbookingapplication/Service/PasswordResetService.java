package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Entity.PasswordResetToken;
import com.naren.movieticketbookingapplication.Record.PasswordResetRequest;
import com.naren.movieticketbookingapplication.Repo.PasswordRTRepository;
import com.naren.movieticketbookingapplication.Utils.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PasswordResetService {


    private final PasswordRTRepository tokenRepository;
    private final EmailService emailService;
    private final CustomerService customerService;

    public PasswordResetService(PasswordRTRepository tokenRepository, EmailService emailService, CustomerService customerService) {
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.customerService = customerService;
    }

    public void createPasswordResetToken(String email) {
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiry(Instant.now().plus(3, ChronoUnit.HOURS));

        tokenRepository.deleteByEmail(email);
        tokenRepository.save(resetToken);

        try {
            emailService.sendPasswordResetMail(email, token);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException("Failed to send email");
        }
    }

    public boolean isTokenValid(String token) {
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);
        return resetToken.isPresent() && resetToken.get().getExpiry().isAfter(Instant.now());
    }

    public void resetPassword(PasswordResetRequest passwordResetRequest) {
        var token = passwordResetRequest.token();
        var newPassword = passwordResetRequest.newPassword();
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);
        if (resetToken.isEmpty() || resetToken.get().getExpiry().isBefore(Instant.now())) {
            throw new RuntimeException("Token is Expired or Invalid");
        }
        String email = resetToken.get().getEmail();
        customerService.updatePassword(email, newPassword);
        tokenRepository.deleteByEmail(email);
    }
}
