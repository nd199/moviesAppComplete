package com.naren.moviesapp.Utils;

public interface EmailService {
    void sendOTPEmail(String toEmail, String otp);

    void sendPasswordResetMail(String toEmail, String token);

    void sendInviteEmail(String toEmail, String inviteLink);

    void sendContentManagerInviteEmail(String toEmail, String inviteLink);

    void sendSubscriptionExpiryWarningEmail(String toEmail, String planName, long daysRemaining);

    void sendSubscriptionExpiredEmail(String toEmail, String planName);
}
