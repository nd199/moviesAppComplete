package com.naren.moviesapp.Record;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordChangeRequest(
        
        @NotBlank(message = "Current password is required")
        String currentPassword,
        
        @NotBlank(message = "New password is required")
        @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z\\d!@#$%^&*(),.?\":{}|<>]{8,128}$", 
                message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character")
        String newPassword,
        
        @NotBlank(message = "Password confirmation is required")
        String confirmPassword
) {
    public PasswordChangeRequest {
        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("New password and confirmation must match");
        }
    }
}
