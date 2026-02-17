package com.naren.moviesapp;

import com.naren.moviesapp.Utils.EmailService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public EmailService emailService() {
        return new EmailService() {
            @Override
            public void sendOTPEmail(String toEmail, String otp) {
                System.out.println("Mock OTP email sent to: " + toEmail + " with OTP: " + otp);
            }

            @Override
            public void sendPasswordResetMail(String toEmail, String token) {
                System.out.println("Mock password reset email sent to: " + toEmail + " with token: " + token);
            }
        };
    }
}