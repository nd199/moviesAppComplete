package com.naren.moviesapp.jwt;

import com.naren.moviesapp.Service.TokenBlacklistService;
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
        logger.debug("JWT FILTER EXECUTING: {}", path);

        // Skip JWT validation for OTP endpoints - these are public
        // Use lowercase comparison for case-insensitive matching
        String pathLower = path.toLowerCase();
        if (pathLower.startsWith("/api/v1/verify/email") || 
            pathLower.startsWith("/api/v1/validate/otp") ||
            pathLower.startsWith("/verify/email") ||
            pathLower.startsWith("/validate/otp") ||
            // Also handle paths without api/v1 prefix (when frontend omits it)
            pathLower.equals("/verify/email") ||
            pathLower.equals("/validate/otp")) {
            logger.debug("Skipping JWT filter for public OTP endpoint: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            jakarta.servlet.http.Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (jakarta.servlet.http.Cookie cookie : cookies) {
                    if ("jwt_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        if (token == null) {
            logger.debug("No token found in request");
            filterChain.doFilter(request, response);
            return;
        }

        if (tokenBlacklistService.isTokenBlacklisted(token)) {
            logger.debug("Token is blacklisted");
            filterChain.doFilter(request, response);
            return;
        }

        String userName = jwtUtil.getSubject(token);
        logger.debug("Extracted username from token: {}", userName);

        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
            logger.debug("Loaded user details for: {}", userName);

            boolean valid = jwtUtil.isTokenValid(token, userDetails.getUsername());
            logger.debug("Token validation result: {}", valid);

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
        }

        filterChain.doFilter(request, response);
    }
}
