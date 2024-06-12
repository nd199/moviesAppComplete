package com.naren.movieticketbookingapplication.Utils;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmSService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.account.auth_token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;


    public void sendOtpRequest(String toPhoneNumber, String otp) {
        try {
            Twilio.init(accountSid, authToken);
            Message message = Message.creator(
                            new PhoneNumber(toPhoneNumber),
                            new PhoneNumber(twilioPhoneNumber),
                            "Your OTP is: " + otp)
                    .create();
            log.info("SMS sent successfully: {}", message.getSid());
        } catch (Exception e) {
            log.error("Error sending OTP: {}", e.getMessage());
        }
    }
}
