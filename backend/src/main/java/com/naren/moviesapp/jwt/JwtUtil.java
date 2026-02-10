package com.naren.moviesapp.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Exception.AlgorithmNotSupportedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    private static final SecretKey SECRET_KEY;

    static {
        try {
            SECRET_KEY = generateSecretKey();
        } catch (NoSuchAlgorithmException e) {
            throw new AlgorithmNotSupportedException("Algorithm not supported");
        }
    }

    private static SecretKey generateSecretKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("HmacSHA256");
        return keyGenerator.generateKey();
    }

//
//    public String issueToken(String subject, String... scopes) {
//        return issueToken(subject, Map.of("scopes", scopes));
//    }

    public String issueToken(String subject, Map<String, Object> claims) {
        return Jwts.builder().claims(claims)
                .subject(subject)
                .issuer("codeNaren.com")
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(30, ChronoUnit.MINUTES)))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String issueToken(String subject, Set<Role> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);

        return Jwts
                .builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(30, ChronoUnit.MINUTES)))
                .signWith(SECRET_KEY)
                .compact();
    }
    private Claims getClaims(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload();
    }

    public String getSubject(String token) {
        return getClaims(token).getSubject();
    }

//    public Set<String> getRoles(String token) {
//        //noinspection unchecked
//        return (Set<String>) getClaims(token).get("roles");
//    }

    public boolean isTokenValid(String token, String userName) {
        try {
            Claims claims = getClaims(token);
            boolean isValid = claims.getSubject().equals(userName) && !isTokenExpired(claims);
            if (!isValid) {
                logger.warn("Invalid JWT token for user: {}", userName);
            }
            return isValid;
        } catch (Exception e) {
            logger.error("JWT token validation failed: {}", e.getMessage());
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
}
