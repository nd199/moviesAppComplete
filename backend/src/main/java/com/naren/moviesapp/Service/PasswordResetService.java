package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.PasswordResetToken;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.PasswordResetRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.PasswordRTRepository;
import com.naren.moviesapp.Utils.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final CustomerRepository customerRepository;

    public PasswordResetService(PasswordRTRepository tokenRepository, EmailService emailService, CustomerService customerService, CustomerRepository customerRepository) {
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.customerService = customerService;
        this.customerRepository = customerRepository;
    }

    public void createPasswordResetToken(String email) {
        if (!customerRepository.existsByEmail(email)) {
            throw new ResourceNotFoundException("Your account " +
                    "is not present please check your email else register first");
        }
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
