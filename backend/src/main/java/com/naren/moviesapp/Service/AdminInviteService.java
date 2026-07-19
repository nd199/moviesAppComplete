package com.naren.moviesapp.Service;

import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.jwt.JwtUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class AdminInviteService {

    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    public AdminInviteService(JwtUtil jwtUtil, RedisTemplate<String, String> redisTemplate) {
        this.jwtUtil = jwtUtil;
        this.redisTemplate = redisTemplate;
    }

    public String generateInviteToken(String email, RoleName role) {
        Map<String, Object> claims = Map.of(
                "email", email,
                "role", role.name(),
                "type", "admin_invite",
                "exp", System.currentTimeMillis() + (7L * 24 * 60 * 60 * 1000)
        );

        String token = jwtUtil.issueToken(email, claims);
        redisTemplate.opsForValue().set("invite:" + token, email, 7, TimeUnit.DAYS);
        return token;
    }

    public boolean validateInviteToken(String token) {
        String email = redisTemplate.opsForValue().get("invite:" + token);
        return email != null;
    }

    public void consumeInviteToken(String token) {
        redisTemplate.delete("invite:" + token);
    }

    public String getEmailFromToken(String token) {
        Map<String, Object> claims = jwtUtil.extractAllClaims(token);
        return (String) claims.get("email");
    }
}
