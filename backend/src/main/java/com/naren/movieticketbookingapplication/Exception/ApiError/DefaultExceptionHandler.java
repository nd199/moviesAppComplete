package com.naren.movieticketbookingapplication.Exception.ApiError;

import com.naren.movieticketbookingapplication.Exception.IncorrectPasswordException;
import com.naren.movieticketbookingapplication.Exception.ResourceAlreadyExists;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Exception.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
@Slf4j
public class DefaultExceptionHandler {


    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<ApiError> handleResourceAlreadyExists(HttpServletRequest request,
                                                                ResourceAlreadyExists e) {
        ApiError error = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                CONFLICT.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, CONFLICT);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    public ResponseEntity<ApiError> handleInsufficientAuthenticationException(InsufficientAuthenticationException e,
                                                                              HttpServletRequest request) {
        log.warn("Handling InsufficientAuthenticationException: {}", e.getMessage());

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                FORBIDDEN.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, FORBIDDEN);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentialsException(BadCredentialsException e,
                                                                  HttpServletRequest request) {
        log.error("Handling BadCredentialsException: {}", e.getMessage());

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Profile Not Found / Invalid username or password",
                UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleUserNotFoundException(UserNotFoundException e,
                                                                HttpServletRequest request) {
        log.warn("Handling UserNotFoundException: {}", e.getMessage());

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, NOT_FOUND);
    }

    @ExceptionHandler(IncorrectPasswordException.class)
    public ResponseEntity<ApiError> handleIncorrectPasswordException(IncorrectPasswordException e,
                                                                     HttpServletRequest request) {
        log.warn("Handling IncorrectPasswordException: {}", e.getMessage());

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, UNAUTHORIZED);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception e,
                                                           HttpServletRequest request) {
        log.error("Handling Exception: {}", e.getMessage(), e);

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "An unexpected error occurred",
                INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(apiError, INTERNAL_SERVER_ERROR);
    }
}
