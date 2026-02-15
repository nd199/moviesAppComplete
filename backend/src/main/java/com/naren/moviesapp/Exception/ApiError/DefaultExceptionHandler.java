package com.naren.moviesapp.Exception.ApiError;

import com.naren.moviesapp.Exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.management.relation.RoleNotFoundException;
import java.sql.SQLException;
import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class DefaultExceptionHandler {
    
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException e,
                                                              HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                UNAUTHORIZED.value(),
                LocalDateTime.now(),
                e.getErrorCode()
        );
        return new ResponseEntity<>(apiError, UNAUTHORIZED);
    }
    
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiError> handleInvalidCredentials(InvalidCredentialsException e,
                                                             HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                UNAUTHORIZED.value(),
                LocalDateTime.now(),
                e.getErrorCode()
        );
        return new ResponseEntity<>(apiError, UNAUTHORIZED);
    }
    
    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<ApiError> handleEmailNotVerified(EmailNotVerifiedException e,
                                                           HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                FORBIDDEN.value(),
                LocalDateTime.now(),
                e.getErrorCode()
        );
        return new ResponseEntity<>(apiError, FORBIDDEN);
    }
    
    @ExceptionHandler(AccountNotRegisteredException.class)
    public ResponseEntity<ApiError> handleAccountNotRegistered(AccountNotRegisteredException e,
                                                            HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                FORBIDDEN.value(),
                LocalDateTime.now(),
                e.getErrorCode()
        );
        return new ResponseEntity<>(apiError, FORBIDDEN);
    }
    
    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ApiError> handleAccountLocked(AccountLockedException e,
                                                        HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                LOCKED.value(),
                LocalDateTime.now(),
                e.getErrorCode()
        );
        return new ResponseEntity<>(apiError, LOCKED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException e,
                                                           HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                NOT_FOUND.value(),
                LocalDateTime.now(),
                "RESOURCE_NOT_FOUND"
        );
        return new ResponseEntity<>(apiError, NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException e,
                                                         HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Invalid username or password. Please try again.",
                UNAUTHORIZED.value(),
                LocalDateTime.now(),
                "BAD_CREDENTIALS"
        );
        return new ResponseEntity<>(apiError, UNAUTHORIZED);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ApiError> handleRoleNotFound(RoleNotFoundException e,
                                                       HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "The specified role does not exist.",
                BAD_REQUEST.value(),
                LocalDateTime.now(),
                "ROLE_NOT_FOUND"
        );
        return new ResponseEntity<>(apiError, BAD_REQUEST);
    }

    @ExceptionHandler({SQLException.class, DataAccessException.class})
    public ResponseEntity<ApiError> handleDatabaseErrors(Exception e,
                                                         HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "A database error occurred. Please try again later.",
                INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "DATABASE_ERROR"
        );
        return new ResponseEntity<>(apiError, INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception e,
                                                           HttpServletRequest request) {
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Something went wrong on our side. Please try again later.",
                INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "INTERNAL_ERROR"
        );
        return new ResponseEntity<>(apiError, INTERNAL_SERVER_ERROR);
    }
}