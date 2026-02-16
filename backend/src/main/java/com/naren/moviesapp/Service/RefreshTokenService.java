package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.RefreshToken;
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
    private final JwtUtil jwtUtil;

    @Value("${jwt.refresh-expiration-days:7}")
    private long refreshExpirationDays;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    public RefreshToken createRefreshToken(Customer user) {
        // Delete existing refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken(
                user,
                UUID.randomUUID().toString(),
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );

        refreshToken = refreshTokenRepository.save(refreshToken);
        logger.info("Created new refresh token for user: {}", user.getEmail());

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
                existingToken.getUser(),
                UUID.randomUUID().toString(),
                Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS)
        );

        // Delete old token
        refreshTokenRepository.delete(existingToken);

        newRefreshToken = refreshTokenRepository.save(newRefreshToken);
        logger.info("Rotated refresh token for user: {}", existingToken.getUser().getEmail());

        return newRefreshToken;
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> !rt.isExpired())
                .orElse(null);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token is expired");
        }
        return token;
    }

    public void deleteRefreshToken(String token) {
        RefreshToken refreshToken = findByToken(token);
        if (refreshToken != null) {
            refreshTokenRepository.delete(refreshToken);
            logger.info("Deleted refresh token");
        }
    }

    public void deleteByUser(Customer user) {
        refreshTokenRepository.deleteByUser(user);
        logger.info("Deleted all refresh tokens for user: {}", user.getEmail());
    }

    public boolean isValidRefreshToken(String token) {
        try {
            RefreshToken refreshToken = findByToken(token);
            if (refreshToken != null) {
                verifyExpiration(refreshToken);
                return true;
            }
        } catch (Exception e) {
            logger.warn("Invalid refresh token: {}", e.getMessage());
        }
        return false;
    }
}
