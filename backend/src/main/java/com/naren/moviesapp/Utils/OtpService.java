package com.naren.moviesapp.Utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final long OTP_EXPIRE_INTERVAL = 5;
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final EmailService emailService;

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    //Register Verification
    public void generateAndSendMailOtp(String email) {
        logger.info("Generating OTP for email: {}", email);
        String otp = generateOtp();
        String key = generateKey(email);

        OtpData otpData = new OtpData(otp, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRE_INTERVAL));
        otpStore.put(key, otpData);

        emailService.sendOTPEmail(email, otp);
        logger.info("OTP sent successfully to email: {}", email);
    }

    //Forgot Password
    public void generateAndSendOtp(Long customerId, String sentType, String verificationType) {
        logger.info("Generating OTP for customerId: {}, type: {}", customerId, verificationType);
        String otp = generateOtp();
        String key = generateKey(customerId, verificationType);

        OtpData otpData = new OtpData(otp, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRE_INTERVAL));
        otpStore.put(key, otpData);

        emailService.sendOTPEmail(sentType, otp);
        logger.info("OTP sent successfully for customerId: {}", customerId);
    }

    public boolean validateOtp(Long customerID, String verificationType, String enteredOtp) {
        logger.debug("Validating OTP for customerId: {}, type: {}", customerID, verificationType);
        String key = generateKey(customerID, verificationType);
        return validateOtpInternal(key, enteredOtp);
    }

    public boolean validateOtp(String customerEmail, String enteredOtp) {
        logger.debug("Validating OTP for email: {}", customerEmail);
        String key = generateKey(customerEmail);
        return validateOtpInternal(key, enteredOtp);
    }

    private boolean validateOtpInternal(String key, String enteredOtp) {
        OtpData otpData = otpStore.get(key);
        if (otpData == null) {
            logger.warn("OTP validation failed: No OTP found for key");
            return false;
        }

        // Check if OTP has expired
        if (System.currentTimeMillis() > otpData.expiryTime) {
            otpStore.remove(key);
            logger.warn("OTP validation failed: OTP expired");
            return false;
        }

        boolean isValid = otpData.otp.equals(enteredOtp);
        if (isValid) {
            logger.info("OTP validated successfully");
            otpStore.remove(key); // Remove OTP after successful validation
        } else {
            logger.warn("OTP validation failed: Invalid OTP");
        }
        return isValid;
    }

    private String generateKey(String email) {
        return "One Time Password : " + email;
    }

    private String generateKey(Long customerId, String type) {
        return "One Time Password : " + customerId + ":" + type;
    }

    private String generateOtp() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

    // Inner class to store OTP with expiry time
    private static class OtpData {
        final String otp;
        final long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}
