package com.naren.moviesapp.Exception;

public class AccountLockedException extends AuthenticationException {
    public AccountLockedException(String message) {
        super(message, "ACCOUNT_LOCKED");
    }
}
