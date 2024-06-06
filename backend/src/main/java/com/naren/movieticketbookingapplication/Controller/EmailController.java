package com.naren.movieticketbookingapplication.Controller;


import com.naren.movieticketbookingapplication.Utilities.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    private final VerificationService verificationService;


    public EmailController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        return verificationService.verifyEmail(token);
    }

}
