package com.naren.movieticketbookingapplication.Utils;

public interface EmailService {
    void sendOTPEmail(String toEmail, String otp);

    void sendPasswordResetMail(String toEmail, String token);
}
