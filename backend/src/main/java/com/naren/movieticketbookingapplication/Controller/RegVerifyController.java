package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Record.VerifyOtpRequest;
import com.naren.movieticketbookingapplication.Service.CustomerService;
import com.naren.movieticketbookingapplication.Utils.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class RegVerifyController {

    private final CustomerService customerService;
    private final OtpService otpService;

    public RegVerifyController(CustomerService customerService, OtpService otpService) {
        this.customerService = customerService;
        this.otpService = otpService;
    }

    @PostMapping("/verify/email")
    public ResponseEntity<String> sendEmailToCustomer(@RequestBody String email) {
        System.out.println("****************************************" + email + "********************************");
        customerService.generateAndSendMailOtp(email);
        return ResponseEntity.ok("OTP sent to email: " + email);
    }

    @PostMapping("/validate/otp")
    public ResponseEntity<String> verifyEmailOtp(@RequestBody VerifyOtpRequest request) {
        String email = request.email();
        String enteredOtp = request.enteredOTP();

        boolean isOtpValid = otpService.validateOtp(email, enteredOtp);
        
        if (isOtpValid) {
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid OTP or OTP expired");
        }
    }
}
