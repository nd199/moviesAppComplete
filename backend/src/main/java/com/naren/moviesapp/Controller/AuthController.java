package com.naren.moviesapp.Controller;

import com.naren.moviesapp.Auth.AuthRequest;
import com.naren.moviesapp.Auth.AuthResponse;
import com.naren.moviesapp.Auth.AuthService;
import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.RefreshTokenService;
import com.naren.moviesapp.Service.TokenBlacklistService;
import com.naren.moviesapp.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "API endpoints for user authentication and authorization")
public class AuthController {
    private final AuthService authService;
    private final CustomerService customerService;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, CustomerService customerService, RefreshTokenService refreshTokenService, TokenBlacklistService tokenBlacklistService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.customerService = customerService;
        this.refreshTokenService = refreshTokenService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/customers")
    @Operation(summary = "Register a new customer", description = "Creates a new user account with customer role")
    public ResponseEntity<?> addCustomer(@Valid @RequestBody CustomerRegistration customerRegistration) {
        ResponseEntity<?> response = customerService.registerUser(customerRegistration, Set.<String>of("ROLE_USER"));
        return response;
    }

    @PostMapping("/admins")
    public ResponseEntity<?> addAdmin(@Valid @RequestBody CustomerRegistration customerRegistration) {
        ResponseEntity<?> response = customerService.registerUser(customerRegistration, Set.<String>of("ROLE_ADMIN"));
        return response;
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns JWT tokens")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(authRequest);

        addAuthCookies(response, authResponse);

        return ResponseEntity.ok()
                .body((java.lang.Object) authResponse.customerDTO());
    }

    @PostMapping("/loginAdmin")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody AuthRequest authRequest, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(authRequest);

        addAuthCookies(response, authResponse);

        return ResponseEntity.ok()
                .body((java.lang.Object) authResponse);
    }

    private void addAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authResponse.customerDTO().user());

        boolean isProduction = !java.util.Arrays.asList("dev", "development", "local")
                .contains(System.getProperty("spring.profiles.active", "default"));

        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", authResponse.token())
                .httpOnly(true)
                .secure(isProduction)  // Only secure in production
                .path("/")
                .maxAge(30 * 60)
                .sameSite(isProduction ? "Strict" : "Lax")  // Lax for development
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken.getToken())
                .httpOnly(true)
                .secure(isProduction)  // Only secure in production
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .sameSite(isProduction ? "Strict" : "Lax")  // Lax for development
                .build();

        response.addHeader("Set-Cookie", jwtCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue("refresh_token") String refreshToken, HttpServletResponse response) {
        RefreshToken token = refreshTokenService.findByToken(refreshToken);
        if (token == null || token.isExpired()) {
            return ResponseEntity.badRequest().body("Invalid or expired refresh token");
        }

        // Generate new JWT token
        String newJwtToken = authService.generateTokenForUser(token.getUser());

        // Set new JWT cookie
        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", newJwtToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(30 * 60) // 30 minutes
                .sameSite("Strict")
                .build();

        response.addHeader("Set-Cookie", jwtCookie.toString());

        return ResponseEntity.ok().body("Token refreshed successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(value = "refresh_token", required = false) String refreshToken,
                                    @RequestHeader(value = "Authorization", required = false) String authHeader,
                                    HttpServletResponse response) {

        // Handle refresh token logout (existing logic)
        if (refreshToken != null) {
            RefreshToken token = refreshTokenService.findByToken(refreshToken);
            if (token != null) {
                refreshTokenService.deleteByUser(token.getUser());
            }
        }

        // Handle JWT token blacklisting (new logic)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwtToken = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(jwtToken, jwtUtil.getExpirationTime());
        }

        // Clear cookies
        boolean isProduction = !java.util.Arrays.asList("dev", "development", "local")
                .contains(System.getProperty("spring.profiles.active", "default"));

        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", "")
                .httpOnly(true)
                .secure(isProduction)  // Only secure in production
                .path("/")
                .maxAge(0)
                .sameSite(isProduction ? "Strict" : "Lax")  // Lax for development
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(isProduction)  // Only secure in production
                .path("/")
                .maxAge(0)
                .sameSite(isProduction ? "Strict" : "Lax")  // Lax for development
                .build();

        response.addHeader("Set-Cookie", jwtCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());

        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "status", "success"
        ));
    }

}
