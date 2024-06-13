package com.naren.movieticketbookingapplication.Utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Component
public class OtpService {

    private static final long OTP_EXPIRE_INTERVAL = 5;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private SmSService smSService;

    @Autowired
    private EmailService emailService;


    //Register Verification
    public void generateAndSendMailOtp(String email) {
        String otp = generateOtp();

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();

        String key = generateKey(email);

        valueOperations.set(key, otp, OTP_EXPIRE_INTERVAL, TimeUnit.MINUTES);

        emailService.sendOTPEmail(email, otp);
    }

    public void generateAndSendPhoneOtp(String phoneNumber) {
        String otp = generateOtp();

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();

        String key = generateKey(phoneNumber);

        valueOperations.set(key, otp, OTP_EXPIRE_INTERVAL, TimeUnit.MINUTES);

        smSService.sendOtpRequest(phoneNumber, otp);
    }

    private String generateKey(Long number) {
        return "One Time Password : " + number.toString();
    }

    private String generateKey(String email) {
        return "One Time Password : " + email;
    }


    //Forgot Password
    public void generateAndSendOtp(Long customerId, String sentType, String verificationType) {
        String otp = generateOtp();

        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String key = generateKey(customerId, verificationType);

        valueOperations.set(key, otp, OTP_EXPIRE_INTERVAL, TimeUnit.MINUTES);

        if ("mobile".equalsIgnoreCase(verificationType)) {
            smSService.sendOtpRequest(sentType, otp);
        } else if ("mail".equalsIgnoreCase(verificationType)) {
            emailService.sendOTPEmail(sentType, otp);
        }
    }

    public boolean validateOtp(Long customerID, String verificationType, String enteredOtp) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String key = generateKey(customerID, verificationType);
        String storedOtp = ops.get(key);
        if (enteredOtp == null) return false;
        assert storedOtp != null;
        return storedOtp.equals(enteredOtp);
    }
    public boolean validateOtp(String customerEmail, String enteredOtp) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        String key = generateKey(customerEmail);
        String storedOtp = ops.get(key);
        if (enteredOtp == null) return false;
        assert storedOtp != null;
        return storedOtp.equals(enteredOtp);
    }

    private String generateKey(Long customerId, String type) {
        return "One Time Password : " + customerId + ":" + type;
    }

    private String generateOtp() {
        Random random = new Random();
        return String.valueOf(100000 + random.nextInt(900000));
    }

}
