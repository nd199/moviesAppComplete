package com.naren.movieticketbookingapplication.Utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String userName;


    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendOTPEmail(String toEmail, String otp) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // true indicates multipart message
            helper.setFrom(userName);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP");
            helper.setText("Your OTP is: " + otp);
            String htmlContent = "<div style=\"padding: 20px; background-color: #f5f5f5;\">"
                    + "<p style=\"font-size: 18px;\">Hi,</p>"
                    + "<p style=\"font-size: 18px;\">Thanks for your password reset request. Please confirm it's you by entering the OTP below on our app:</p>"
                    + "<div style=\"background-color: #8a2be2; padding: 10px; text-align: center; margin-top: 20px;\">"
                    + "<p style=\"font-size: 24px; color: #ffffff;\">Your OTP: " + otp + "</p>"
                    + "<button style=\"background-color: #8a2be2; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;\">Copy OTP</button>"
                    + "</div></div>";
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Error sending email to: " + toEmail + ". Error: " + e.getMessage());
        }
    }
}
