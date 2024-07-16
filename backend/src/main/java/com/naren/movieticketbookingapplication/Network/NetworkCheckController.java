package com.naren.movieticketbookingapplication.Network;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class NetworkCheckController {

    @GetMapping("/nwtChk")
    public ResponseEntity<String> networkCheck() {
        return ResponseEntity.ok("HELLO NAREN CONNECTED TO FRONTEND");
    }
}
