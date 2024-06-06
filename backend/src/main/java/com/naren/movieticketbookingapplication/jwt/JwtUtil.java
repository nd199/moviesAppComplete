package com.naren.movieticketbookingapplication.jwt;

import com.naren.movieticketbookingapplication.Entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
public class JwtUtil {

    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final SecretKey SECRET_KEY_FOR_EMAIL = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String issueGeneralToken(String subject, String... scopes) {
        return issueGeneralToken(subject, Map.of("scopes", scopes));
    }

    public String issueGeneralToken(String subject, Map<String, Object> claims) {
        log.debug("Issuing JWT token for subject: {}", subject);
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuer("codeNaren.com")
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(15, ChronoUnit.DAYS)))
                .signWith(SECRET_KEY)
                .compact();
        log.debug("Issued token: {}", token);
        return token;
    }

    public String issueGeneralToken(String subject, Set<Role> roles, Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("subject", subject);
        claims.put("roles", roles);
        claims.put("reg-date", new Date(System.currentTimeMillis()));
        claims.put("user-type", "regular");
        claims.put("user-id", userId);

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(15, ChronoUnit.DAYS)))
                .signWith(SECRET_KEY)
                .compact();
        log.debug("Issued token: {}", token);
        return token;
    }

    public Claims getClaims(String token, boolean isEmailToken) {
        log.debug("Parsing and verifying JWT token: {}", token);
        try {
            SecretKey key = isEmailToken ? SECRET_KEY_FOR_EMAIL : SECRET_KEY;
            Claims claims = Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            log.debug("Parsed claims: {}", claims);
            return claims;
        } catch (Exception e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
            throw new RuntimeException("Invalid token or token has expired", e);
        }
    }

    public String getSubject(String token, boolean isEmailToken) {
        Claims claims = getClaims(token, isEmailToken);
        log.debug("Getting subject from JWT token: {}", claims.getSubject());
        return claims.getSubject();
    }

    public boolean isTokenValid(String token, String userName, boolean isEmailToken) {
        try {
            Claims claims = getClaims(token, isEmailToken);
            boolean isValid = claims.getSubject().equals(userName) && !isTokenExpired(claims);
            if (!isValid) {
                log.warn("JWT token validation failed for subject: {}", userName);
            }
            return isValid;
        } catch (Exception e) {
            log.error("Error validating JWT token: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        boolean isExpired = expiration != null && expiration.before(Date.from(Instant.now()));
        if (isExpired) {
            log.warn("JWT token has expired");
        }
        return isExpired;
    }

    public String issueGeneralToken(String subject, List<String> roles) {
        return issueGeneralToken(subject, Map.of("roles", roles));
    }

    // For email verification with additional security
    public String issueEmailToken(String subject, Long userId, Boolean isVerified, String verificationToken) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("subject", subject);
        claims.put("reg-date", new Date(System.currentTimeMillis()));
        claims.put("user-type", "regular");
        claims.put("user-id", userId);
        claims.put("verification-token", verificationToken);
        claims.put("isVerified", isVerified);
        claims.put("token-type", "email");

        String token = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plus(3, ChronoUnit.DAYS)))
                .signWith(SECRET_KEY_FOR_EMAIL)
                .compact();
        log.debug("Issued email verification token: {}", token);
        return token;
    }

    public String generateRandomVerificationToken() {
        return UUID.randomUUID().toString();
    }

    public String extractVerificationToken(String token) {
        Claims claims = getClaims(token, true);
        log.debug("Extracting verification token from JWT token");
        return (String) claims.get("verification-token");
    }
}
