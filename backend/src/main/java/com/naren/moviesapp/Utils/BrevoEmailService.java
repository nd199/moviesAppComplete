package com.naren.moviesapp.Utils;

import com.naren.moviesapp.Exception.EmailSendingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("emailService")
@Profile("prod")
public class BrevoEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(BrevoEmailService.class);

    private final RestTemplate restTemplate;
    private final TemplateEngine templateEngine;

    @Value("${app.brevo.api-key}")
    private String brevoApiKey;

    @Value("${app.brevo.sender.email}")
    private String senderEmail;

    @Value("${app.brevo.sender.name:MoviesApp}")
    private String senderName;

    public BrevoEmailService(TemplateEngine templateEngine) {
        this.restTemplate = new RestTemplate();
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendOTPEmail(String toEmail, String otp) {
        try {
            // Prepare HTML content from Thymeleaf template
            Context context = new Context();
            context.setVariable("otp", otp);
            String htmlContent = templateEngine.process("otp-email", context);

            sendViaBrevoAPI(toEmail, "Your OTP Code", htmlContent);
            logger.info("OTP email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new EmailSendingException("Failed to send OTP email to " + toEmail, e);
        }
    }

    @Override
    public void sendPasswordResetMail(String toEmail, String token) {
        try {
            String resetLink = "https://movies-app-complete.vercel.app/forgotPassword?token=" + token;

            Context context = new Context();
            context.setVariable("resetLink", resetLink);
            String htmlContent = templateEngine.process("password-reset-mail", context);

            sendViaBrevoAPI(toEmail, "Password Reset Request", htmlContent);
            logger.info("Password reset email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage(), e);
            throw new EmailSendingException("Failed to send password reset email to " + toEmail, e);
        }
    }

    private void sendViaBrevoAPI(String toEmail, String subject, String htmlContent) {
        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);

        // Build request body safely using Maps
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", senderName, "email", senderEmail));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("subject", subject);
        body.put("htmlContent", htmlContent);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
        } catch (HttpClientErrorException e) {
            logger.error("Brevo API call failed. Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new EmailSendingException("Failed to send email via Brevo API", e);
        } catch (Exception e) {
            logger.error("Unexpected error while sending email via Brevo API: {}", e.getMessage(), e);
            throw new EmailSendingException("Unexpected error while sending email via Brevo API", e);
        }
    }
}