package com.naren.moviesapp.Utils;

import com.naren.moviesapp.Exception.EmailSendingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final long OTP_EXPIRE_INTERVAL_MIN = 5; // 5 minutes

    private final EmailService emailService;
    private final RedisTemplate<String, String> redisTemplate;

    public OtpService(EmailService emailService, RedisTemplate<String, String> redisTemplate) {
        this.emailService = emailService;
        this.redisTemplate = redisTemplate;
    }

    // ===== Generate OTP for email (registration / verification) =====
    public void generateAndSendMailOtp(String email) {
        String normalizedEmail = email.toLowerCase().trim();
        String key = generateKey(normalizedEmail);

        // Check if a valid OTP exists
        if (redisTemplate.hasKey(key)) {
            logger.warn("OTP already sent and still valid for email: {}. Resending same OTP.", email);
            String existingOtp = redisTemplate.opsForValue().get(key);
            emailService.sendOTPEmail(email, existingOtp);
            return;
        }

        String otp = generateOtp();
        redisTemplate.opsForValue().set(key, otp, OTP_EXPIRE_INTERVAL_MIN, TimeUnit.MINUTES);

        emailService.sendOTPEmail(email, otp);
        logger.info("OTP sent successfully to email: {}", email);
    }

    // ===== Validate OTP =====
    public boolean validateOtp(String email, String enteredOtp) {
        String normalizedEmail = email.toLowerCase().trim();
        String key = generateKey(normalizedEmail);
        String savedOtp = redisTemplate.opsForValue().get(key);

        if (savedOtp == null) {
            logger.warn("OTP validation failed: OTP expired or not found for email: {}", email);
            return false;
        }

        if (!savedOtp.equals(enteredOtp)) {
            logger.warn("OTP validation failed: Invalid OTP for email: {}", email);
            return false;
        }

        // OTP is valid, remove it
        redisTemplate.delete(key);
        logger.info("OTP validated successfully for email: {}", email);
        return true;
    }

    // ===== Helpers =====
    private String generateKey(String email) {
        return "otp:" + email;
    }

    private String generateOtp() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000)); // 6-digit OTP
    }
}