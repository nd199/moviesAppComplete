package com.naren.moviesapp.Record;

import jakarta.validation.constraints.*;

public record CustomerUpdateRequest(
        @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
        String name,
        
        @Email(message = "Invalid email format")
        @Size(max = 100, message = "Email must not exceed 100 characters")
        String email,
        
        @Min(value = 1000000000L, message = "Invalid phone number")
        @Max(value = 9999999999L, message = "Invalid phone number")
        Long phoneNumber,
        
        @Size(max = 500, message = "Image URL must not exceed 500 characters")
        String imageUrl, 
        
        Boolean isEmailVerified,
        
        @Size(max = 200, message = "Address must not exceed 200 characters")
        String address,
        
        Boolean isLogged, 
        
        Boolean isRegistered
) {
}
