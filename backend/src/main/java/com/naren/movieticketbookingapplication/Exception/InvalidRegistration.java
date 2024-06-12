package com.naren.movieticketbookingapplication.Exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidRegistration extends RuntimeException {
    public InvalidRegistration(String message) {
        super(message);
    }
}
