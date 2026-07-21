package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.RefreshTokenRepository;
import com.naren.moviesapp.jwt.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {
    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final CustomerRepository customerRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration-days:7}")
    private long refreshExpirationDays;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               CustomerRepository customerRepository,
                               AdminRepository adminRepository,
                               JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.customerRepository = customerRepository;
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
    }

    public RefreshToken createRefreshToken(Customer customer, String deviceFingerprint) {
        return createRefreshTokenInternal(customer.getId(), UserType.CUSTOMER, deviceFingerprint);
    }

    public RefreshToken createRefreshToken(Admin admin, String deviceFingerprint) {
        return createRefreshTokenInternal(admin.getId(), UserType.ADMIN, deviceFingerprint);
    }

    public RefreshToken createRefreshToken(ContentManager contentManager, String deviceFingerprint) {
        return createRefreshTokenInternal(contentManager.getId(), UserType.ADMIN, deviceFingerprint);
    }

    private RefreshToken createRefreshTokenInternal(Long userId, UserType userType, String deviceFingerprint) {
        deleteByUserIdAndUserType(userId, userType);

        RefreshToken refreshToken = new RefreshToken(
                userId,
                userType,
                UUID.randomUUID().toString(),
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );
        refreshToken.setDeviceFingerprint(deviceFingerprint);

        refreshToken = refreshTokenRepository.save(refreshToken);
        logger.info("Created new refresh token for user: {} {} (device: {})", userType, userId, deviceFingerprint);

        return refreshToken;
    }

    /**
     * Rotate a refresh token with theft detection and device binding.
     *
     * Security flow:
     * 1. Check device fingerprint → different device = THEFT → revoke all
     * 2. If the token was already used → THEFT → revoke all
     * 3. Mark old token as used
     * 4. Create new token in the same family, SAME device
     * 5. Delete old token
     *
     * @return the new refresh token
     * @throws RuntimeException if token is invalid or theft is detected
     */
    @Transactional
    public RefreshToken rotateRefreshToken(String token, String deviceFingerprint) {
        RefreshToken existingToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (existingToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            throw new RuntimeException("Refresh token expired");
        }

        if (!existingToken.getDeviceFingerprint().equals(deviceFingerprint)) {
            logger.warn("DEVICE MISMATCH THEFT DETECTED for user: {} {} — expected: {}, got: {}",
                    existingToken.getUserType(), existingToken.getUserId(),
                    existingToken.getDeviceFingerprint(), deviceFingerprint);
            revokeAllUserTokens(existingToken.getUserId(), existingToken.getUserType());
            throw new RuntimeException("Device mismatch detected. All sessions revoked for security.");
        }

        if (existingToken.isUsed()) {
            logger.warn("TOKEN REUSE THEFT DETECTED for user: {} {} — family: {}",
                    existingToken.getUserType(), existingToken.getUserId(), existingToken.getFamilyId());
            revokeAllUserTokens(existingToken.getUserId(), existingToken.getUserType());
            throw new RuntimeException("Token reuse detected. All sessions revoked for security.");
        }

        existingToken.setUsed(true);
        refreshTokenRepository.save(existingToken);

        RefreshToken newRefreshToken = new RefreshToken(
                existingToken.getUserId(),
                existingToken.getUserType(),
                UUID.randomUUID().toString(),
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );
        newRefreshToken.setFamilyId(existingToken.getFamilyId());
        newRefreshToken.setDeviceFingerprint(existingToken.getDeviceFingerprint());

        newRefreshToken = refreshTokenRepository.save(newRefreshToken);

        refreshTokenRepository.delete(existingToken);

        logger.info("Rotated refresh token for user: {} {} (family: {}, device: {})",
                existingToken.getUserType(), existingToken.getUserId(),
                existingToken.getFamilyId(), existingToken.getDeviceFingerprint());

        return newRefreshToken;
    }

    /**
     * Revoke ALL refresh tokens for a user — used when theft is detected.
     */
    public void revokeAllUserTokens(Long userId, UserType userType) {
        refreshTokenRepository.deleteByUserIdAndUserType(userId, userType);
        logger.warn("Revoked ALL refresh tokens for user: {} {}", userType, userId);
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> !rt.isExpired())
                .orElse(null);
    }

    public void deleteRefreshToken(String token) {
        RefreshToken refreshToken = findByToken(token);
        if (refreshToken != null) {
            refreshTokenRepository.delete(refreshToken);
            logger.info("Deleted refresh token");
        }
    }

    public void deleteByUserIdAndUserType(Long userId, UserType userType) {
        refreshTokenRepository.deleteByUserIdAndUserType(userId, userType);
        logger.info("Deleted all refresh tokens for user: {} {}", userType, userId);
    }

    public boolean isValidRefreshToken(String token) {
        try {
            RefreshToken refreshToken = findByToken(token);
            if (refreshToken != null) {
                verifyExpiration(refreshToken);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public String generateTokenFromRefreshToken(String refreshTokenValue) {
        RefreshToken refreshToken = findByToken(refreshTokenValue);
        if (refreshToken == null) {
            throw new RuntimeException("Refresh token not found");
        }

        verifyExpiration(refreshToken);

        if (UserType.ADMIN.equals(refreshToken.getUserType())) {
            Admin admin = adminRepository.findById(refreshToken.getUserId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return jwtUtil.issueTokenWithRoleExpiration(admin.getEmail(), admin.getRoles());
        } else if (UserType.CUSTOMER.equals(refreshToken.getUserType())) {
            Customer customer = customerRepository.findById(refreshToken.getUserId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            return jwtUtil.issueTokenWithRoleExpiration(customer.getEmail(), customer.getRoles());
        }

        throw new RuntimeException("Unknown user type: " + refreshToken.getUserType());
    }
}
