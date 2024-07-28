package com.naren.movieticketbookingapplication.Controller;

import com.naren.movieticketbookingapplication.Record.CustomerSubscription;
import com.naren.movieticketbookingapplication.Service.CustomerService;
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

        System.out.println("Received email: " + customerSubscription.email());

        // Check if the received object is correctly mapped
        if (customerSubscription.email() == null) {
            return ResponseEntity.badRequest().body("Invalid request body");
        }

        return customerService.pingSubscription(customerSubscription);
    }

}
