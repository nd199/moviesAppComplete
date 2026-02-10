package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Record.CustomerSubscription;
import com.naren.moviesapp.Service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubsPingController {
    private final CustomerService customerService;

    public SubsPingController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/pingSpring")
    public ResponseEntity<?> pingSubscription(@RequestBody CustomerSubscription customerSubscription) {
        // Check if the received object is correctly mapped
        if (customerSubscription.email() == null) {
            return ResponseEntity.<String>badRequest().body("Invalid request body");
        }

        return customerService.pingSubscription(customerSubscription);
    }

}
