package com.naren.moviesapp.Auth;

import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Repo.ContentManagerRepository;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.RefreshTokenService;
import com.naren.moviesapp.Service.TokenBlacklistService;
import com.naren.moviesapp.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        logger.info("Login request received for username: {}", request.username());
        AuthResponse authResponse = authService.login(request);

        // Generate access token and refresh token based on user type
        String accessToken;
        RefreshToken refreshToken;

        if (authResponse instanceof AdminAuthResponse adminAuth) {
            accessToken = authService.generateTokenForAdmin(adminAuth.admin());
            // Superadmin: no refresh token for maximum security - must login again
            refreshToken = null;
        } else if (authResponse instanceof CustomerAuthResponse customerAuth) {
            accessToken = authService.generateTokenForCustomer(customerAuth.customer());
            refreshToken = refreshTokenService.createRefreshToken(customerAuth.customer());
        } else if (authResponse instanceof ContentManagerAuthResponse cmAuth) {
            accessToken = authService.generateTokenForContentManager(cmAuth.contentManager());
            refreshToken = refreshTokenService.createRefreshToken(cmAuth.contentManager());
        } else {
            throw new RuntimeException("Unknown auth response type");
        }

        logger.info("Login successful for username: {}", request.username());
        // Return tokens and user data in response body
        Map<String, Object> responseBody = new java.util.HashMap<>();
        responseBody.put("accessToken", accessToken);
        responseBody.put("refreshToken", refreshToken != null ? refreshToken.getToken() : null);

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
        return ResponseEntity.ok(responseBody);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        logger.debug("Token refresh request received");
        String refreshTokenValue = request.get("refreshToken");

        if (refreshTokenValue == null) {
            logger.warn("Refresh token missing in request");
            return ResponseEntity.badRequest().body("Refresh token missing");
        }

        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenValue);
        if (refreshToken == null || refreshToken.isExpired()) {
            logger.warn("Invalid or expired refresh token");
            return ResponseEntity.status(401).body("Invalid or expired refresh token");
        }

        // Delete old refresh token and create new one
        refreshTokenService.deleteByUserIdAndUserType(refreshToken.getUserId(), refreshToken.getUserType());
        RefreshToken newRefreshToken = refreshTokenService.rotateRefreshToken(refreshTokenValue);

        // Generate new access token
        String newAccessToken = authService.generateTokenFromRefreshToken(refreshTokenValue);

        logger.info("Token refreshed successfully for user: {} {}", refreshToken.getUserType(), refreshToken.getUserId());
        return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken.getToken()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required = false) Map<String, String> request,
                                    @RequestHeader(value = "Authorization", required = false) String authHeader) {
        logger.info("Logout request received");
        String refreshToken = request != null ? request.get("refreshToken") : null;
        if (refreshToken != null) {
            RefreshToken token = refreshTokenService.findByToken(refreshToken);
            if (token != null) {
                refreshTokenService.deleteByUserIdAndUserType(token.getUserId(), token.getUserType());
                logger.debug("Refresh token deleted for user: {} {}", token.getUserType(), token.getUserId());
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
        logger.info("Logout successful");
        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "status", "success"
        ));
    }
}