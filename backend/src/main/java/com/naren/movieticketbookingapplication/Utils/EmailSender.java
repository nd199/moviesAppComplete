package com.naren.movieticketbookingapplication.Utils;

public interface EmailSender {
    void sendOTPEmail(String toEmail, String otp);

    void sendPasswordResetMail(String toEmail, String token);
}
