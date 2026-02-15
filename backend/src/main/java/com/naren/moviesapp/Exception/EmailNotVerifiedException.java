package com.naren.moviesapp.Exception;

public class EmailNotVerifiedException extends AuthenticationException {
    public EmailNotVerifiedException(String message) {
        super(message, "EMAIL_NOT_VERIFIED");
    }
}
