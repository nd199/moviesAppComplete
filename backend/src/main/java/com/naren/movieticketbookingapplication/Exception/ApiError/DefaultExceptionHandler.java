package com.naren.movieticketbookingapplication.Exception.ApiError;

import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class DefaultExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(ResourceNotFoundException e,
                                                           HttpServletRequest request) {
        log.warn("Resource not found: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, NOT_FOUND);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiError> handleInsufficientAuth(InsufficientAuthenticationException e,
                                                           HttpServletRequest request) {
        log.warn("Authentication error: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "You are not authorized to access this resource.",
                FORBIDDEN.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException e,
                                                         HttpServletRequest request) {
        log.warn("Invalid credentials: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Invalid username or password. Please try again.",
                UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, UNAUTHORIZED);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ApiError> handleRoleNotFound(RoleNotFoundException e,
                                                       HttpServletRequest request) {
        log.warn("Role not found: {}", e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "The specified role does not exist.",
                BAD_REQUEST.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, BAD_REQUEST);
    }

    @ExceptionHandler({SQLException.class, DataAccessException.class})
    public ResponseEntity<ApiError> handleDatabaseErrors(Exception e,
                                                         HttpServletRequest request) {
        log.error("Database error: {}", e.getMessage(), e);
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "A database error occurred. Please try again later.",
                INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, INTERNAL_SERVER_ERROR);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception e,
                                                           HttpServletRequest request) {
        log.error("Unexpected error: {}", e.getMessage(), e);
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Something went wrong on our side. Please try again later.",
                INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, INTERNAL_SERVER_ERROR);
    }
}