package com.naren.moviesapp.Auth;
import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Repo.ContentManagerRepository;
import com.naren.moviesapp.Service.CustomerService;
import com.naren.moviesapp.Service.RefreshTokenService;
import com.naren.moviesapp.Service.TokenBlacklistService;
import com.naren.moviesapp.jwt.JwtUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        logger.info("Login request received for username: {}", request.username());
        AuthResponse authResponse = authService.login(request);
        // Generate access token and refresh token
        String accessToken = jwtUtil.generateTokenForUser(authResponse.getUser());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authResponse.getUser());
        logger.info("Login successful for username: {}", request.username());
        // Return tokens and user data in response body
        Map<String, Object> responseBody = new java.util.HashMap<>();
        responseBody.put("accessToken", accessToken);
        responseBody.put("refreshToken", refreshToken.getToken());
        
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
        refreshTokenService.deleteByUser(refreshToken.getUser());
        RefreshToken newRefreshToken =
                refreshTokenService.createRefreshToken(refreshToken.getUser());
        String newAccessToken = jwtUtil.generateTokenForUser(refreshToken.getUser());
        logger.info("Token refreshed successfully for user: {}", refreshToken.getUser().getEmail());
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
        logger.info("Logout successful");
        return ResponseEntity.ok(Map.of(
                "message", "Logged out successfully",
                "status", "success"
        ));
    }
}