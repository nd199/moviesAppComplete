package com.naren.moviesapp.Utils;

import com.naren.moviesapp.Exception.EmailSendingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
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
        logger.info("Starting OTP email sending process to: {}", toEmail);
        
        try {
            // Check configuration
            if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
                logger.error("Brevo API key is null or empty");
                throw new EmailSendingException("Brevo API key is not configured");
            }
            if (senderEmail == null || senderEmail.trim().isEmpty()) {
                logger.error("Brevo sender email is null or empty");
                throw new EmailSendingException("Brevo sender email is not configured");
            }
            
            logger.debug("Brevo API key present: {}, Sender email: {}", 
                brevoApiKey != null ? "YES" : "NO", senderEmail);
            
            // Prepare HTML content from Thymeleaf template
            logger.debug("Processing Thymeleaf template for email: {}", toEmail);
            Context context = new Context();
            context.setVariable("otp", otp);
            context.setVariable("email", toEmail);
            String htmlContent = templateEngine.process("otp-email", context);
            
            if (htmlContent == null || htmlContent.trim().isEmpty()) {
                logger.error("Thymeleaf template processing returned null or empty content");
                throw new EmailSendingException("Failed to process email template");
            }
            
            logger.debug("Template processed successfully, content length: {}", htmlContent.length());

            sendViaBrevoAPI(toEmail, "Your OTP Code", htmlContent);
            logger.info("OTP email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}: {}", toEmail, e.getMessage(), e);
            throw new EmailSendingException("Failed to send OTP email to " + toEmail + ": " + e.getMessage(), e);
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
        logger.debug("Sending email via Brevo API to: {}", toEmail);

        // Validate configuration
        if (brevoApiKey == null || brevoApiKey.trim().isEmpty()) {
            logger.error("Brevo API key is not configured");
            throw new EmailSendingException("Brevo API key is not configured");
        }
        if (senderEmail == null || senderEmail.trim().isEmpty()) {
            logger.error("Brevo sender email is not configured");
            throw new EmailSendingException("Brevo sender email is not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", brevoApiKey);
        
        logger.debug("Brevo API headers configured, API key length: {}", brevoApiKey.length());

        // Build request body safely using Maps
        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", senderName, "email", senderEmail));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("subject", subject);
        body.put("htmlContent", htmlContent);
        
        logger.debug("Request body built, sender: {}, recipient: {}", senderEmail, toEmail);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            logger.debug("Making POST request to Brevo API: {}", url);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            logger.info("Brevo API response status: {}", response.getStatusCode());
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("Brevo API returned non-2xx status: {}, body: {}", 
                    response.getStatusCode(), response.getBody());
                throw new EmailSendingException("Brevo API returned status: " + response.getStatusCode());
            }
            
        } catch (HttpClientErrorException e) {
            logger.error("Brevo API call failed. Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new EmailSendingException("Brevo API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (ResourceAccessException e) {
            logger.error("Network error when calling Brevo API: {}", e.getMessage());
            throw new EmailSendingException("Network error when calling Brevo API: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error while sending email via Brevo API: {}", e.getMessage(), e);
            throw new EmailSendingException("Unexpected error while sending email via Brevo API: " + e.getMessage(), e);
        }
    }
}