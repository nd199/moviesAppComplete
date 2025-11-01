package com.naren.movieticketbookingapplication.Utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Profile("dev")
@Service
public class SmtpEmailService implements EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String username;

    public SmtpEmailService(JavaMailSender javaMailSender, SpringTemplateEngine templateEngine) {
        this.javaMailSender = javaMailSender;
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendOTPEmail(String toEmail, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(username);
            helper.setTo(toEmail);
            helper.setSubject("Your OTP");

            Context context = new Context();
            context.setVariable("email", toEmail);
            context.setVariable("otp", otp);
            String htmlContent = templateEngine.process("otp-email", context);

            helper.setText(htmlContent, true);
            javaMailSender.send(message);

            System.out.println("SMTP Email sent to " + toEmail);
        } catch (MessagingException e) {
            System.err.println("SMTP Email send failed: " + e.getMessage());
        }
    }

    @Override
    public void sendPasswordResetMail(String toEmail, String token) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(username);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request");

            Context context = new Context();
            context.setVariable("email", toEmail);
            context.setVariable("resetLink", "https://movies-app-complete.vercel.app/forgotPassword?token=" + token);
            String htmlContent = templateEngine.process("password-reset-mail", context);

            helper.setText(htmlContent, true);
            javaMailSender.send(message);

            System.out.println("SMTP Password reset sent to " + toEmail);
        } catch (MessagingException e) {
            System.err.println("SMTP Password reset failed: " + e.getMessage());
        }
    }
}