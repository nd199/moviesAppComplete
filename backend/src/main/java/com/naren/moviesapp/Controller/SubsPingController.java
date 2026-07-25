package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Record.CustomerSubscription;
import com.naren.moviesapp.Service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubsPingController {

    private static final Logger log = LoggerFactory.getLogger(SubsPingController.class);
    private final CustomerService customerService;

    public SubsPingController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/pingSpring")
    public ResponseEntity<?> pingSubscription(@RequestBody CustomerSubscription customerSubscription) {
        if (customerSubscription.email() == null) {
            log.warn("Received pingSpring with null email");
            return ResponseEntity.<String>badRequest().body("Invalid request body");
        }

        log.info("Subscription ping for email={}", customerSubscription.email());
        return customerService.pingSubscription(customerSubscription);
    }

}
