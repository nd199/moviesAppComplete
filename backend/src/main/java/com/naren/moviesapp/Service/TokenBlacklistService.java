package com.naren.moviesapp.Service;

import com.naren.moviesapp.jwt.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenBlacklistService {

    private static final Logger logger = LoggerFactory.getLogger(TokenBlacklistService.class);
    private static final String BLACKLIST_PREFIX = "blacklist:";
    private static final long DEFAULT_BLACKLIST_DURATION = 30;

    private final RedisTemplate<String, String> redisTemplate;
    private final JwtUtil jwtUtil;

    public TokenBlacklistService(RedisTemplate<String, String> redisTemplate, JwtUtil jwtUtil) {
        this.redisTemplate = redisTemplate;
        this.jwtUtil = jwtUtil;
    }

    public void blacklistToken(String token, long expirationTime) {
        try {
            String jti = jwtUtil.getJti(token);
            if (jti != null) {
                long ttl = calculateTTL(expirationTime);
                redisTemplate.opsForValue().set(
                        BLACKLIST_PREFIX + jti, "true",
                        ttl, TimeUnit.MINUTES);
                logger.info("Token {} blacklisted", jti);
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
            String jti = jwtUtil.getJti(token);
            if (jti != null) {
                return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + jti));
            }
        } catch (Exception e) {
            logger.error("Failed to check blacklist status: {}", e.getMessage());
        }
        return false;
    }

    private long calculateTTL(long expirationTime) {
        long currentTime = System.currentTimeMillis();
        long ttl = (expirationTime - currentTime) / (60 * 1000);
        return Math.max(ttl, 1);
    }
}
