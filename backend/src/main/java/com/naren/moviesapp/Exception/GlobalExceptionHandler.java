package com.naren.moviesapp.Exception;

import com.naren.moviesapp.Exception.ApiError.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest request) {
        logger.warn("Resource not found: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now(),
                "RESOURCE_NOT_FOUND"
        );
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ResourceAlreadyExists.class)
    public ResponseEntity<ApiError> handleResourceAlreadyExists(ResourceAlreadyExists e, HttpServletRequest request) {
        logger.warn("Resource already exists: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.CONFLICT.value(),
                LocalDateTime.now(),
                "RESOURCE_ALREADY_EXISTS"
        );
        return new ResponseEntity<>(apiError, HttpStatus.CONFLICT);
    }

    @ExceptionHandler({AdminNotFoundException.class, UserNotFoundException.class})
    public ResponseEntity<ApiError> handleNotFoundExceptions(RuntimeException e, HttpServletRequest request) {
        logger.warn("Not found exception: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now(),
                "NOT_FOUND"
        );
        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AdminAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleAdminAlreadyExists(AdminAlreadyExistsException e, HttpServletRequest request) {
        logger.warn("Admin already exists: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.CONFLICT.value(),
                LocalDateTime.now(),
                "ADMIN_ALREADY_EXISTS"
        );
        return new ResponseEntity<>(apiError, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(PasswordInvalidException.class)
    public ResponseEntity<ApiError> handlePasswordInvalid(PasswordInvalidException e, HttpServletRequest request) {
        logger.warn("Invalid password: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "INVALID_PASSWORD"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RequestValidationException.class)
    public ResponseEntity<ApiError> handleRequestValidation(RequestValidationException e, HttpServletRequest request) {
        logger.warn("Request validation error: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "VALIDATION_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ApiError> handleRoleNotFound(RoleNotFoundException e, HttpServletRequest request) {
        logger.warn("Role not found: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "ROLE_NOT_FOUND"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidRegistration.class)
    public ResponseEntity<ApiError> handleInvalidRegistration(InvalidRegistration e, HttpServletRequest request) {
        logger.warn("Invalid registration: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "INVALID_REGISTRATION"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException e, HttpServletRequest request) {
        logger.warn("Bad credentials: {}", request.getRequestURI());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Invalid credentials",
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now(),
                "INVALID_CREDENTIALS"
        );
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ApiError> handleDisabledAccount(DisabledException e, HttpServletRequest request) {
        logger.warn("Account disabled: {}", request.getRequestURI());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Account is disabled",
                HttpStatus.FORBIDDEN.value(),
                LocalDateTime.now(),
                "ACCOUNT_DISABLED"
        );
        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ApiError> handleLockedAccount(LockedException e, HttpServletRequest request) {
        logger.warn("Account locked: {}", request.getRequestURI());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Account is locked",
                HttpStatus.FORBIDDEN.value(),
                LocalDateTime.now(),
                "ACCOUNT_LOCKED"
        );
        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        logger.warn("Access denied: {}", request.getRequestURI());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Access denied",
                HttpStatus.FORBIDDEN.value(),
                LocalDateTime.now(),
                "ACCESS_DENIED"
        );
        return new ResponseEntity<>(apiError, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException e, HttpServletRequest request) {
        logger.warn("Validation exception: {} - {}", request.getRequestURI(), e.getMessage());
        Map<String, String> errors = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiError apiError = new ApiError(
                request.getRequestURI(),
                "Validation failed: " + errors,
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "VALIDATION_FAILED"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<ApiError> handlePaymentProcessing(PaymentProcessingException e, HttpServletRequest request) {
        logger.error("Payment processing error: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "PAYMENT_PROCESSING_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TokenRefreshException.class)
    public ResponseEntity<ApiError> handleTokenRefresh(TokenRefreshException e, HttpServletRequest request) {
        logger.warn("Token refresh error: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now(),
                "TOKEN_REFRESH_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ApiError> handleTokenExpired(TokenExpiredException e, HttpServletRequest request) {
        logger.warn("Token expired: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now(),
                "TOKEN_EXPIRED"
        );
        return new ResponseEntity<>(apiError, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<ApiError> handleEmailSending(EmailSendingException e, HttpServletRequest request) {
        logger.error("Email sending error: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "EMAIL_SENDING_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ProductOperationException.class)
    public ResponseEntity<ApiError> handleProductOperation(ProductOperationException e, HttpServletRequest request) {
        logger.error("Product operation error: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "PRODUCT_OPERATION_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(PasswordResetException.class)
    public ResponseEntity<ApiError> handlePasswordReset(PasswordResetException e, HttpServletRequest request) {
        logger.warn("Password reset error: {} - {}", request.getRequestURI(), e.getMessage());
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now(),
                "PASSWORD_RESET_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception e, HttpServletRequest request) {
        logger.error("Unexpected error: {} - {}", request.getRequestURI(), e.getMessage(), e);
        
        ApiError apiError = new ApiError(
                request.getRequestURI(),
                e.getMessage() != null ? e.getMessage() : "An unexpected error occurred",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "INTERNAL_ERROR"
        );
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
