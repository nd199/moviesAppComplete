package com.naren.moviesapp.jwt;

import com.naren.moviesapp.Config.RolePermissionMapper;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
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

    @Value("${jwt.expiration-minutes:15}")
    private long jwtExpirationMinutes;

    @Value("${jwt.superadmin-expiration-minutes:5}")
    private long superadminExpirationMinutes;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

        if (keyBytes.length < 32) {
            keyBytes = java.util.Arrays.copyOf(keyBytes, 32);
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

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
        Set<String> authorities = new HashSet<>();

        if (roles == null || roles.isEmpty()) {
            logger.warn("No roles found for user: {}, adding default ROLE_USER", subject);
            authorities.add("ROLE_USER");
        } else {
            roles.forEach(role -> {
                if (role != null && role.getName() != null) {
                    authorities.add(role.getName().name());
                    try {
                        RolePermissionMapper.getPermissions(role.getName())
                                .forEach(permission -> authorities
                                        .add(permission.name()));
                    } catch (Exception e) {
                        logger.error("Error getting permissions for role {}: {}",
                                role.getName(), e.getMessage());
                    }
                } else {
                    logger.warn("Null role found for user: {}", subject);
                }
            });
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("authorities", authorities);
        claims.put("type", "access");

        return issueToken(subject, claims);
    }

    public Collection<? extends GrantedAuthority> getAuthorities(String token) {
        Claims claims = getClaims(token);
        Object authoritiesObject = claims.get("authorities");

        if (!(authoritiesObject instanceof Collection<?> collection)) {
            return Collections.emptyList();
        }

        return collection.stream()
                .map(Object::toString)
                .map(SimpleGrantedAuthority::new)
                .toList();
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

            String type = claims.get("type", String.class);

            return claims.getSubject().equals(userName)
                    && !isTokenExpired(claims)
                    && jwtIssuer.equals(claims.getIssuer())
                    && "access".equals(type);
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
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

    public Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    public Claims extractAllClaims(String token) {
        return getClaims(token);
    }

    public String issueTokenWithRoleExpiration(String subject, Set<Role> roles) {
        boolean isSuperAdmin = roles != null && roles.stream()
                .anyMatch(role -> role.getName() == RoleName.ROLE_SUPER_ADMIN);
        
        long expirationMinutes = isSuperAdmin ? superadminExpirationMinutes : jwtExpirationMinutes;

        logger.debug("Token expiration set to {} minutes for user {} (superadmin: {})", 
                    expirationMinutes, subject, isSuperAdmin);

        Map<String, Object> enhancedClaims = new HashMap<>();
        enhancedClaims.put("jti", UUID.randomUUID().toString());
        enhancedClaims.put("iat", System.currentTimeMillis() / 1000);

        return Jwts.builder()
                .claims(enhancedClaims)
                .subject(subject)
                .issuer(jwtIssuer)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES)))
                .signWith(getSigningKey())
                .compact();
    }
}
