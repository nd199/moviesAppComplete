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
        logger.info("Starting OTP generation for email: {}", email);
        
        String normalizedEmail = email.toLowerCase().trim();
        String key = generateKey(normalizedEmail);
        
        logger.debug("Normalized email: {}, Redis key: {}", normalizedEmail, key);

        try {
            // Check if a valid OTP exists
            logger.debug("Checking if OTP already exists for email: {}", email);
            if (redisTemplate.hasKey(key)) {
                logger.warn("OTP already sent and still valid for email: {}. Resending same OTP.", email);
                String existingOtp = redisTemplate.opsForValue().get(key);
                logger.debug("Retrieved existing OTP from Redis: {}", existingOtp);
                emailService.sendOTPEmail(email, existingOtp);
                return;
            }

            String otp = generateOtp();
            logger.debug("Generated new OTP: {} for email: {}", otp, email);
            
            redisTemplate.opsForValue().set(key, otp, OTP_EXPIRE_INTERVAL_MIN, TimeUnit.MINUTES);
            logger.debug("Stored OTP in Redis with expiration: {} minutes", OTP_EXPIRE_INTERVAL_MIN);

            emailService.sendOTPEmail(email, otp);
            logger.info("OTP sent successfully to email: {}", email);
            
        } catch (Exception e) {
            logger.error("Error in OTP generation process for email {}: {}", email, e.getMessage(), e);
            throw e; // Re-throw to let the controller handle it
        }
    }

    // ===== Validate OTP =====
    public boolean validateOtp(String email, String enteredOtp) {
        logger.debug("Validating OTP for email: {}", email);
        
        String normalizedEmail = email.toLowerCase().trim();
        String key = generateKey(normalizedEmail);
        String savedOtp = redisTemplate.opsForValue().get(key);
        
        logger.debug("Retrieved saved OTP from Redis: {} for key: {}", savedOtp, key);

        if (savedOtp == null) {
            logger.warn("OTP validation failed: OTP expired or not found for email: {}", email);
            return false;
        }

        if (!savedOtp.equals(enteredOtp)) {
            logger.warn("OTP validation failed: Invalid OTP for email: {}. Expected: {}, Got: {}", 
                email, savedOtp, enteredOtp);
            return false;
        }

        // OTP is valid, remove it
        redisTemplate.delete(key);
        logger.info("OTP validated successfully for email: {}", email);
        return true;
    }

    // ===== Helpers =====
    private String generateKey(String email) {
        String key = "otp:" + email;
        logger.debug("Generated Redis key: {} for email: {}", key, email);
        return key;
    }

    private String generateOtp() {
        Random random = new Random();
        String otp = String.valueOf(100000 + random.nextInt(900000)); // 6-digit OTP
        logger.debug("Generated 6-digit OTP: {}", otp);
        return otp;
    }
}