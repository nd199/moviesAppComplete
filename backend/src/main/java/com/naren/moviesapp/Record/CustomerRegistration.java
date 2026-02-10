package com.naren.moviesapp.Record;

import jakarta.validation.constraints.*;

public record CustomerRegistration(
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,
        
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Size(max = 100, message = "Email must not exceed 100 characters")
        String email,
        
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String password,
        
        @NotNull(message = "Phone number is required")
        @Min(value = 1000000000L, message = "Invalid phone number")
        @Max(value = 9999999999L, message = "Invalid phone number")
        Long phoneNumber,
        
        @Size(max = 500, message = "Image URL must not exceed 500 characters")
        String imageUrl, 
        
        Boolean isEmailVerified,
        
        @NotBlank(message = "Address is required")
        @Size(max = 200, message = "Address must not exceed 200 characters")
        String address,
        
        Boolean isLogged, 
        
        Boolean isRegistered
) {
}
