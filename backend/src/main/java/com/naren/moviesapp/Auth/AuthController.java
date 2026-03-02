package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Repo.ContentManagerRepository;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.RefreshTokenService;
import com.naren.moviesapp.Service.TokenBlacklistService;
import com.naren.moviesapp.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Authentication & Authorization APIs")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final CustomerService customerService;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlacklistService tokenBlacklistService;
    private final JwtUtil jwtUtil;
    private final ContentManagerRepository contentManagerRepository;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    public AuthController(AuthService authService,
                          CustomerService customerService,
                          RefreshTokenService refreshTokenService,
                          TokenBlacklistService tokenBlacklistService,
                          JwtUtil jwtUtil,
                          ContentManagerRepository contentManagerRepository) {
        this.authService = authService;
        this.customerService = customerService;
        this.refreshTokenService = refreshTokenService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.jwtUtil = jwtUtil;
        this.contentManagerRepository = contentManagerRepository;
    }

    @PostMapping("/customers")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody CustomerRegistration request) {
        logger.info("Customer registration request received for email: {}", request.email());
        return customerService.registerUser(request, Set.of("ROLE_USER"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request,
                                   HttpServletResponse response) {
        logger.info("Login request received for username: {}", request.username());

        AuthResponse authResponse = authService.login(request);

        setAuthCookies(response, authResponse);

        logger.info("Login successful for username: {}", request.username());

        // Return user data with token as fallback for cookie issues
        Map<String, Object> responseBody = new java.util.HashMap<>();

        // Handle different response types
        if (authResponse instanceof AdminAuthResponse adminAuth) {
            responseBody.put("user", adminAuth.adminDTO());
            responseBody.put("userType", "ADMIN");
        } else if (authResponse instanceof CustomerAuthResponse customerAuth) {
            responseBody.put("user", customerAuth.customerDTO());
            responseBody.put("userType", "CUSTOMER");
        } else if (authResponse instanceof ContentManagerAuthResponse cmAuth) {
            responseBody.put("user", cmAuth.contentManagerDTO());
            responseBody.put("userType", "CONTENT_MANAGER");
        }
        responseBody.put("token", authResponse.token());

        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String refreshTokenValue,
            HttpServletResponse response) {

        logger.debug("Token refresh request received");

        if (refreshTokenValue == null) {
            logger.warn("Refresh token missing in request");
            return ResponseEntity.badRequest().body("Refresh token missing");
        }

        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue);

        if (refreshToken == null || refreshToken.isExpired()) {
            logger.warn("Invalid or expired refresh token");
            return ResponseEntity.status(401).body("Invalid or expired refresh token");
        }

        refreshTokenService.deleteByUser(refreshToken.getUser());
        RefreshToken newRefreshToken =
                refreshTokenService.createRefreshToken(refreshToken.getUser());

        String newJwt = authService.generateTokenForUser(refreshToken.getUser());

        setCookies(response, newJwt, newRefreshToken.getToken());

        logger.info("Token refreshed successfully for user: {}", refreshToken.getUser().getEmail());
        return ResponseEntity.ok(Map.of("message", "Token refreshed"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @CookieValue(name = "refresh_token", required = false) String refreshToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletResponse response) {

        logger.info("Logout request received");

        if (refreshToken != null) {
            RefreshToken token = refreshTokenService.findByToken(refreshToken);
            if (token != null) {
                refreshTokenService.deleteByUser(token.getUser());
                logger.debug("Refresh token deleted for user: {}", token.getUser().getEmail());
            }
        } else {
            logger.debug("No refresh token found in request (likely admin logout)");
        }

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String jwt = authHeader.substring(7);
                long expiry = jwtUtil.extractExpiration(jwt).getTime();
                tokenBlacklistService.blacklistToken(jwt, expiry);
                logger.debug("JWT token blacklisted during logout");
            } catch (Exception e) {
                logger.warn("Failed to blacklist JWT token during logout: {}", e.getMessage());
            }
        }

        clearCookies(response);

        logger.info("Logout successful");
        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "status", "success"
        ));
    }

    private void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        // Check response type and handle accordingly
        if (authResponse instanceof CustomerAuthResponse customerAuth) {
            // Customer login - create refresh token
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(customerAuth.customerDTO().user());
            setCookies(response, customerAuth.token(), refreshToken.getToken());
        } else {
            // Admin login - only set JWT token, no refresh token needed
            setJwtOnlyCookie(response, authResponse.token());
        }
    }

    private void setJwtOnlyCookie(HttpServletResponse response, String jwt) {
        boolean isProduction = activeProfile.equals("prod");
        String domain = null;

        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", jwt)
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(Duration.ofMinutes(30))
                .sameSite(isProduction ? "None" : "Lax")
                .domain(domain)
                .build();

        logger.info("Setting JWT-only cookie for admin - Production: {}, Domain: {}, SameSite: {}",
                isProduction, domain, isProduction ? "None" : "Lax");
        logger.debug("JWT Cookie: {}", jwtCookie);

        response.addHeader("Set-Cookie", jwtCookie.toString());
    }

    private void setCookies(HttpServletResponse response,
                            String jwt,
                            String refreshToken) {

        boolean isProduction = activeProfile.equals("prod");
        String domain = null;

        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", jwt)
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(Duration.ofMinutes(30))
                .sameSite(isProduction ? "None" : "Lax")
                .domain(domain)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite(isProduction ? "None" : "Lax")
                .domain(domain)
                .build();

        logger.info("Setting auth cookies - Production: {}, Domain: {}, SameSite: {}",
                isProduction, domain, isProduction ? "None" : "Lax");
        logger.debug("JWT Cookie: {}", jwtCookie);
        logger.debug("Refresh Cookie: {}", refreshCookie);

        response.addHeader("Set-Cookie", jwtCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }

    private void clearCookies(HttpServletResponse response) {
        boolean isProduction = activeProfile.equals("prod");

        String domain = null;

        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", "")
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(0)
                .sameSite(isProduction ? "None" : "Lax")
                .domain(domain)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(isProduction)
                .path("/")
                .maxAge(0)
                .sameSite(isProduction ? "None" : "Lax")
                .domain(domain)
                .build();

        response.addHeader("Set-Cookie", jwtCookie.toString());
        response.addHeader("Set-Cookie", refreshCookie.toString());
    }
}