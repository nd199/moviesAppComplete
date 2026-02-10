package com.naren.moviesapp.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)

public class AlgorithmNotSupportedException extends RuntimeException {
    public AlgorithmNotSupportedException(String message) {
        super(message);
    }
}