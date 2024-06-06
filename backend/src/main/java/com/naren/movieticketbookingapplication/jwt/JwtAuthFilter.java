package com.naren.movieticketbookingapplication.jwt;

import com.naren.movieticketbookingapplication.Service.CustomerUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, CustomerUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("Starting JWT_FILTER on {}", request.getRequestURI());

        final String authHeader = request.getHeader("Authorization");
        String token = null;
        String userName = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            log.debug("JWT token extracted from header: {}", token);
        } else if (request.getRequestURI().contains("/verify-email")) {
            token = request.getParameter("token");
            log.debug("JWT token extracted from email verification parameter: {}", token);
        }

        if (token == null) {
            log.warn("No JWT token found in the request");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            userName = jwtUtil.getSubject(token, false);// here
            log.debug("JWT token subject (username) extracted: {}", userName);
        } catch (Exception e) {
            log.error("Error extracting username from JWT token: {}", e.getMessage());
        }

        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Security context is null, proceeding with authentication for user: {}", userName);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

            if (userDetails != null && jwtUtil.isTokenValid(token, userDetails.getUsername(), false)) {//here
                log.debug("JWT token validation successful for user: {}", userName);

                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities()
                        );
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                log.debug("Authentication set in security context for user: {}", userName);
            } else {
                log.warn("JWT token validation failed or user details not found for user: {}", userName);
            }
        } else {
            if (userName == null) {
                log.warn("Username is null, cannot proceed with authentication");
            } else {
                log.warn("Authentication already exists in security context for user: {}", userName);
            }
        }

        filterChain.doFilter(request, response);
    }
}
