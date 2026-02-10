package com.naren.moviesapp.Utils;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private static final long OTP_EXPIRE_INTERVAL = 5;
    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final EmailService emailService;

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    //Register Verification
    public void generateAndSendMailOtp(String email) {
        String otp = generateOtp();
        String key = generateKey(email);

        OtpData otpData = new OtpData(otp, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRE_INTERVAL));
        otpStore.put(key, otpData);

        emailService.sendOTPEmail(email, otp);
    }

    //Forgot Password
    public void generateAndSendOtp(Long customerId, String sentType, String verificationType) {
        String otp = generateOtp();
        String key = generateKey(customerId, verificationType);

        OtpData otpData = new OtpData(otp, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(OTP_EXPIRE_INTERVAL));
        otpStore.put(key, otpData);

        emailService.sendOTPEmail(sentType, otp);
    }

    public boolean validateOtp(Long customerID, String verificationType, String enteredOtp) {
        String key = generateKey(customerID, verificationType);
        return validateOtpInternal(key, enteredOtp);
    }

    public boolean validateOtp(String customerEmail, String enteredOtp) {
        String key = generateKey(customerEmail);
        return validateOtpInternal(key, enteredOtp);
    }

    private boolean validateOtpInternal(String key, String enteredOtp) {
        OtpData otpData = otpStore.get(key);
        if (otpData == null) {
            return false;
        }

        // Check if OTP has expired
        if (System.currentTimeMillis() > otpData.expiryTime) {
            otpStore.remove(key);
            return false;
        }

        return otpData.otp.equals(enteredOtp);
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
