package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.*;
import com.naren.moviesapp.Repo.AdminRepository;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repository.RefreshTokenRepository;
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

    public RefreshToken createRefreshToken(Customer customer) {
        return createRefreshTokenInternal(customer.getId(), UserType.CUSTOMER);
    }

    public RefreshToken createRefreshToken(Admin admin) {
        return createRefreshTokenInternal(admin.getId(), UserType.ADMIN);
    }

    public RefreshToken createRefreshToken(ContentManager contentManager) {
        return createRefreshTokenInternal(contentManager.getId(), UserType.ADMIN);
    }

    private RefreshToken createRefreshTokenInternal(Long userId, UserType userType) {
        // Delete existing refresh tokens for this user
        deleteByUserIdAndUserType(userId, userType);

        RefreshToken refreshToken = new RefreshToken(
                userId,
                userType,
                UUID.randomUUID().toString(),
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );

        refreshToken = refreshTokenRepository.save(refreshToken);
        logger.info("Created new refresh token for user: {} {}", userType, userId);

        return refreshToken;
    }

    @Transactional
    public RefreshToken rotateRefreshToken(String token) {
        RefreshToken existingToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (existingToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            throw new RuntimeException("Refresh token expired");
        }

        // Create new refresh token
        RefreshToken newRefreshToken = new RefreshToken(
                existingToken.getUserId(),
                existingToken.getUserType(),
                UUID.randomUUID().toString(),
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );

        // Delete old token
        refreshTokenRepository.delete(existingToken);

        newRefreshToken = refreshTokenRepository.save(newRefreshToken);
        logger.info("Rotated refresh token for user: {} {}", existingToken.getUserType(), existingToken.getUserId());

        return newRefreshToken;
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

        // Load user based on type and generate token
        if (UserType.ADMIN.equals(refreshToken.getUserType())) {
            Admin admin = adminRepository.findById(refreshToken.getUserId())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return jwtUtil.issueToken(admin.getEmail(), admin.getRoles());
        } else if (UserType.CUSTOMER.equals(refreshToken.getUserType())) {
            Customer customer = customerRepository.findById(refreshToken.getUserId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            // For customer, we need to convert roles properly
            return jwtUtil.issueToken(customer.getEmail(), customer.getRoles());
        }

        throw new RuntimeException("Unknown user type: " + refreshToken.getUserType());
    }
}
