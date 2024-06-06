package com.naren.movieticketbookingapplication.Utilities;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    @Value("${spring.mail.username}")
    private String username;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendVerificationEmail(String toAddress, String verificationURL) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(username);
        mailMessage.setTo(toAddress);
        mailMessage.setSubject("Email Verification");
        mailMessage.setText("Click the link below to verify your email address:\n\n" + verificationURL);
        javaMailSender.send(mailMessage);
    }

}
