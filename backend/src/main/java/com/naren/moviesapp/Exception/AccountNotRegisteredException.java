package com.naren.moviesapp.Exception;

public class AccountNotRegisteredException extends AuthenticationException {
    public AccountNotRegisteredException(String message) {
        super(message, "ACCOUNT_NOT_REGISTERED");
    }
}
