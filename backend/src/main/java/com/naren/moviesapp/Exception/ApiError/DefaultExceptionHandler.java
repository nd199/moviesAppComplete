package com.naren.moviesapp.Exception.ApiError;

import com.naren.moviesapp.Exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.management.relation.RoleNotFoundException;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class DefaultExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(DefaultExceptionHandler.class);

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

    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<ApiError> handleResourceAlreadyExists(ResourceAlreadyExists e,
                                                                HttpServletRequest request) {
        logger.warn("Resource already exists: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                CONFLICT.value(),
                LocalDateTime.now(),
                "RESOURCE_ALREADY_EXISTS"
        );
        return new ResponseEntity<>(apiError, CONFLICT);
    }

    @ExceptionHandler(AdminAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleAdminAlreadyExists(AdminAlreadyExistsException e,
                                                             HttpServletRequest request) {
        logger.warn("Admin already exists: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                CONFLICT.value(),
                LocalDateTime.now(),
                "ADMIN_ALREADY_EXISTS"
        );
        return new ResponseEntity<>(apiError, CONFLICT);
    }

    @ExceptionHandler(AdminNotFoundException.class)
    public ResponseEntity<ApiError> handleAdminNotFound(AdminNotFoundException e,
                                                        HttpServletRequest request) {
        logger.warn("Admin not found: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                NOT_FOUND.value(),
                LocalDateTime.now(),
                "ADMIN_NOT_FOUND"
        );
        return new ResponseEntity<>(apiError, NOT_FOUND);
    }

    @ExceptionHandler(PasswordInvalidException.class)
    public ResponseEntity<ApiError> handlePasswordInvalid(PasswordInvalidException e,
                                                          HttpServletRequest request) {
        logger.warn("Password validation failed: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                BAD_REQUEST.value(),
                LocalDateTime.now(),
                "INVALID_PASSWORD"
        );
        return new ResponseEntity<>(apiError, BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(IllegalArgumentException e,
                                                          HttpServletRequest request) {
        logger.warn("Invalid argument: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                BAD_REQUEST.value(),
                LocalDateTime.now(),
                "BAD_REQUEST"
        );
        return new ResponseEntity<>(apiError, BAD_REQUEST);
    }

    @ExceptionHandler(RequestValidationException.class)
    public ResponseEntity<ApiError> handleRequestValidation(RequestValidationException e,
                                                            HttpServletRequest request) {
        logger.warn("Request validation failed: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                BAD_REQUEST.value(),
                LocalDateTime.now(),
                "VALIDATION_ERROR"
        );
        return new ResponseEntity<>(apiError, BAD_REQUEST);
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

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException e,
                                                               HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        String errorMessage = errors.values().stream().findFirst().orElse("Validation failed");

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                errorMessage,
                BAD_REQUEST.value(),
                LocalDateTime.now(),
                "VALIDATION_ERROR"
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
        logger.error("=== GENERIC EXCEPTION CAUGHT ===");
        logger.error("Request URI: {}", request.getRequestURI());
        logger.error("Exception type: {}", e.getClass().getSimpleName());
        logger.error("Exception message: {}", e.getMessage());
        logger.error("Full stack trace:", e);

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