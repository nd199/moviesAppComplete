package com.naren.movieticketbookingapplication.Utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String username;

    public EmailService(JavaMailSender javaMailSender, SpringTemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    public void sendOTPEmail(String toEmail, String otp) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(username);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP");

            Context context = new Context();
            context.setVariable("email", toEmail);
            context.setVariable("otp", otp);
            String htmlContent = templateEngine.process("otp-email", context);

            helper.setText(htmlContent, true);
            javaMailSender.send(mimeMessage);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Error sending email to: " + toEmail + ". Error: " + e.getMessage());
        }
    }

    public void sendPasswordResetMail(String toMail, String token) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(username);
            helper.setTo(toMail);
            helper.setSubject("Password Reset Request");

            Context context = new Context();
            context.setVariable("email", toMail);
            context.setVariable("resetLink", "https://movies-app-complete.vercel.app/forgotPassword?token=" + token);
            String htmlContent = templateEngine.process("password-reset-mail", context);

            helper.setText(htmlContent, true);
            javaMailSender.send(mimeMessage);
            System.out.println("Password reset email sent successfully to: " + toMail);
        } catch (MessagingException e) {
            System.err.println("Error sending password reset email to: " + toMail + ". Error: " + e.getMessage());
        }
    }
}

