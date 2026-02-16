package com.naren.moviesapp.jwt;

import com.naren.moviesapp.Entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret:default-secret-key-that-should-be-changed-in-production-use-at-least-256-bits}")
    private String jwtSecret;

    @Value("${jwt.issuer:codeNaren.com}")
    private String jwtIssuer;

    @Value("${jwt.expiration-minutes:30}")
    private long jwtExpirationMinutes;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                jwtSecret.length() < 44 ?
                        java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes()) :
                        jwtSecret
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }

//
//    public String issueToken(String subject, String... scopes) {
//        return issueToken(subject, Map.of("scopes", scopes));
//    }

    public String issueToken(String subject, Map<String, Object> claims) {
        Map<String, Object> enhancedClaims = new HashMap<>(claims);
        enhancedClaims.put("jti", UUID.randomUUID().toString());
        enhancedClaims.put("iat", System.currentTimeMillis() / 1000);

        return Jwts.builder()
                .claims(enhancedClaims)
                .subject(subject)
                .issuer(jwtIssuer)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(jwtExpirationMinutes, ChronoUnit.MINUTES)))
                .signWith(getSigningKey())
                .compact();
    }

    public String issueToken(String subject, Set<Role> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("type", "access");

        return issueToken(subject, claims);
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getSubject(String token) {
        return getClaims(token).getSubject();
    }

    public String getJti(String token) {
        return getClaims(token).getId();
    }

    public boolean isTokenValid(String token, String userName) {
        try {
            Claims claims = getClaims(token);

            // Enhanced validation with multiple checks
            boolean isValid = claims.getSubject().equals(userName)
                    && !isTokenExpired(claims)
                    && claims.getIssuer().equals(jwtIssuer)
                    && claims.getIssuedAt().before(Date.from(Instant.now()))
                    && claims.get("type", String.class).equals("access");

            if (!isValid) {
                logger.warn("Invalid JWT token for user: {} - Reason validation failed", userName);
            }
            return isValid;
        } catch (Exception e) {
            logger.error("JWT token validation failed for user {}: {}", userName, e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        boolean isExpired = expiration != null && expiration.before(Date.from(Instant.now()));
        if (isExpired) {
            logger.warn("JWT token expired for user");
        }
        return isExpired;
    }

    public long getExpirationTime() {
        return System.currentTimeMillis() + (jwtExpirationMinutes * 60 * 1000);
    }
}
