package com.naren.movieticketbookingapplication.Utils;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.IOException;

@Profile("prod")
@Service
public class SendGridEmailService implements EmailService {

    private final SpringTemplateEngine templateEngine;

    @Value("${spring.sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${spring.sendgrid.from.email}")
    private String fromEmail;

    public SendGridEmailService(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public void sendOTPEmail(String toEmail, String otp) {
        sendEmail(toEmail, "Your OTP", "otp-email", otp, null);
    }

    @Override
    public void sendPasswordResetMail(String toEmail, String token) {
        sendEmail(toEmail, "Password Reset Request", "password-reset-mail", null, token);
    }

    private void sendEmail(String toEmail, String subject, String templateName, String otp, String token) {
        try {
            Context context = new Context();
            context.setVariable("email", toEmail);
            if (otp != null) context.setVariable("otp", otp);
            if (token != null)
                context.setVariable("resetLink", "https://movies-app-complete.vercel.app/forgotPassword?token=" + token);

            String htmlContent = templateEngine.process(templateName, context);

            Email from = new Email(fromEmail);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);

            System.out.println("✅ SendGrid email sent to: " + toEmail);
        } catch (IOException e) {
            System.err.println("❌ SendGrid email failed: " + e.getMessage());
        }
    }
}