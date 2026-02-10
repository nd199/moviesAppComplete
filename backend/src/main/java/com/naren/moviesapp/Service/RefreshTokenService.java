package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.RefreshToken;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class RefreshTokenService {
    
    private final RefreshTokenRepository refreshTokenRepository;
    
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }
    
    public RefreshToken createRefreshToken(Customer user) {
        // Delete existing refresh tokens for this user
        refreshTokenRepository.deleteByUser(user);
        
        RefreshToken refreshToken = new RefreshToken(
            user,
            UUID.randomUUID().toString(),
            Instant.now().plus(7, java.time.temporal.ChronoUnit.DAYS) // 7 days expiry
        );
        
        return refreshTokenRepository.save(refreshToken);
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
    
    public void deleteByUser(Customer user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
