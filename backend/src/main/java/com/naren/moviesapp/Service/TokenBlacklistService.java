package com.naren.moviesapp.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {
    
    private static final Logger logger = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String BLACKLIST_PREFIX = "blacklist:";
    private static final long DEFAULT_BLACKLIST_DURATION = 30; // minutes
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public void blacklistToken(String token, long expirationTime) {
        try {
            String jti = extractJtiFromToken(token);
            if (jti != null) {
                long ttl = calculateTTL(expirationTime);
                redisTemplate.opsForValue().set(BLACKLIST_PREFIX + jti, "true", ttl, TimeUnit.MINUTES);
                logger.info("Token {} blacklisted successfully", jti);
            }
        } catch (Exception e) {
            logger.error("Failed to blacklist token: {}", e.getMessage());
        }
    }
    
    public void blacklistToken(String token) {
        blacklistToken(token, DEFAULT_BLACKLIST_DURATION);
    }
    
    public boolean isTokenBlacklisted(String token) {
        try {
            String jti = extractJtiFromToken(token);
            if (jti != null) {
                return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + jti));
            }
        } catch (Exception e) {
            logger.error("Failed to check blacklist status: {}", e.getMessage());
        }
        return false;
    }
    
    private String extractJtiFromToken(String token) {
        try {
            // This is a simplified extraction - in production, you might want to parse the JWT properly
            String[] parts = token.split("\\.");
            if (parts.length == 3) {
                String payload = new String(java.util.Base64.getUrlDecoder().decode(parts[1]));
                // Simple JSON parsing to extract jti
                int jtiIndex = payload.indexOf("\"jti\":\"");
                if (jtiIndex != -1) {
                    int start = jtiIndex + 7;
                    int end = payload.indexOf("\"", start);
                    return payload.substring(start, end);
                }
            }
        } catch (Exception e) {
            logger.error("Failed to extract JTI from token: {}", e.getMessage());
        }
        return null;
    }
    
    private long calculateTTL(long expirationTime) {
        long currentTime = System.currentTimeMillis();
        long ttl = (expirationTime - currentTime) / (60 * 1000); // Convert to minutes
        return Math.max(ttl, 1); // At least 1 minute
    }
    
    public void removeExpiredTokens() {
        // Redis automatically handles TTL, but this method can be used for manual cleanup
        logger.debug("Token cleanup initiated");
    }
}
