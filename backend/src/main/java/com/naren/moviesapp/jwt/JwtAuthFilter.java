package com.naren.moviesapp.jwt;

import com.naren.moviesapp.Service.TokenBlacklistService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService, TokenBlacklistService tokenBlacklistService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        logger.info("JWT FILTER EXECUTING: {}", path);

        // Skip JWT validation for OTP endpoints - these are public
        // Use lowercase comparison for case-insensitive matching
        String pathLower = path.toLowerCase();
        if (pathLower.startsWith("/api/v1/verify/email") ||
                pathLower.startsWith("/api/v1/validate/otp") ||
                pathLower.startsWith("/verify/email") ||
                pathLower.startsWith("/validate/otp") ||
                pathLower.startsWith("/api/v1/auth/set-password") ||
                pathLower.startsWith("/set-password") ||
                // Also handle paths without api/v1 prefix (when frontend omits it)
                pathLower.equals("/verify/email") ||
                pathLower.equals("/validate/otp") ||
                // Subscription-specific endpoints
                pathLower.contains("subscription")) {
            logger.info("SKIPPING JWT FILTER - PUBLIC ENDPOINT: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        final String authHeader = request.getHeader("Authorization");
        final String requestURI = request.getRequestURI();

        logger.debug("Processing request for URI: {}", requestURI);
        logger.debug("Auth header present: {}", authHeader != null);
        logger.debug("Auth header value: {}", authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.debug("Token extracted from Authorization header: {}", token.substring(0, Math.min(20, token.length())));
        }

        if (token == null) {
            logger.debug("No token found in request for URI: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            logger.debug("Token is blacklisted");
            filterChain.doFilter(request, response);
            return;
        }

        String userName;
        try {
            userName = jwtUtil.getSubject(token);
            logger.debug("Extracted username from token: {}", userName);
        } catch (ExpiredJwtException e) {
            logger.debug("JWT token is expired for URI: {}. Continuing without authentication.", requestURI);
            filterChain.doFilter(request, response);
            return;
        } catch (MalformedJwtException | SignatureException | IllegalArgumentException e) {
            logger.debug("Invalid JWT token for URI: {}. Continuing without authentication. Error: {}", requestURI, e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
                logger.debug("Loaded user details for: {}", userName);

                boolean valid = jwtUtil.isTokenValid(token, userDetails.getUsername());
                logger.debug("Token validation result: {} for user: {}", valid, userName);

                if (valid) {
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, jwtUtil.getAuthorities(token)
                            );
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.debug("Authentication set in security context for: {}", userName);
                }
            } catch (UsernameNotFoundException e) {
                logger.debug("User not found for token: {}. Continuing without authentication.", userName);
            }
        }

        filterChain.doFilter(request, response);
    }
}
