package com.naren.moviesapp.Security;

import com.naren.moviesapp.Service.TokenBlacklistService;
import com.naren.moviesapp.jwt.JwtAuthFilter;
import com.naren.moviesapp.jwt.JwtUtil;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@EnableWebSecurity
@Configuration
public class SecurityFilterChainConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityFilterChainConfig.class);

    @PostConstruct
    public void init() {
        logger.info("SECURITY CONFIG LOADED");
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            @Qualifier("customUserDetailsService") UserDetailsService userDetailsService,
            PasswordEncoder encoder) {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(encoder);
        return provider;
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            String uri = request.getRequestURI();
            String method = request.getMethod();
            String origin = request.getHeader("Origin");
            String referer = request.getHeader("Referer");

            logger.error(
                    "401 UNAUTHORIZED from Spring Security. method={}, uri={}, origin={}, referer={}, message={}",
                    method,
                    uri,
                    origin,
                    referer,
                    authException != null ? authException.getMessage() : null,
                    authException
            );

            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            try {
                response.getWriter().write(
                        "{\"message\":\"Unauthorized\",\"path\":\"" + uri + "\"}"
                );
            } catch (IOException e) {
                logger.error("Failed to write 401 response body for uri={}", uri, e);
            }
        };
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter(
            JwtUtil jwtUtil,
            @Qualifier("customUserDetailsService") UserDetailsService userDetailsService,
            TokenBlacklistService blacklistService) {

        return new JwtAuthFilter(jwtUtil, userDetailsService, blacklistService);
    }

    @Bean
    public SecurityFilterChain customSecurityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider,
            JwtAuthFilter authFilter,
            AuthenticationEntryPoint authenticationEntryPoint) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {
                })  // Enable CORS from WebConfig
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.HEAD, "/**").permitAll()

                        .requestMatchers(
                                "/api/v1/ping",
                                "/",
                                "/error",
                                "/actuator/health",
                                "/api/v1/auth/login",
                                "/api/v1/auth/logout",
                                "/api/v1/auth/refresh-token",
                                "/api/v1/auth/customers",
                                "/api/v1/content-manager/**",
                                "/api/v1/verify/email",
                                "/api/v1/verify/email/exists",
                                "/api/v1/validate/Otp",
                                "/validate/Otp",
                                "/api/v1/validate/otp",
                                "/api/password-reset/**",
                                "/pingSpring",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html",
                                "/superadmin.html",
                                "/setup-password.html",
                                "/api/v1/health/**",
                                "/health/**",
                                "/api/v1/test-data/status",
                                "/api/v1/streaming/**",
                                "/api/v1/subscription/status",
                                "/api/v1/admins/health",
                                "/api/v1/verify/email/subscription",
                                "/api/v1/validate/otp/subscription"
                        ).permitAll()

                        .requestMatchers(
                                "/api/v1/movies/**",
                                "/api/v1/shows/**",
                                "/api/v1/products/**",
                                "/api/v1/about",
                                "/api/v1/tmdb/**",
                                "/api/v1/local/**",
                                "/api/v1/public/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/v1/customers/currentUser",
                                "/api/v1/profile/**",
                                "/api/v1/auth/change-password",
                                "/api/v1/subscription/confirm",
                                "/api/v1/payments/**",
                                "/api/v1/video/**",
                                "/api/v1/bookings/**",
                                "/api/v1/reviews/**",
                                "/api/v1/watchlist/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/v1/customers/**",
                                "/api/v1/roles/**",
                                "/api/v1/admins/**"
                        ).hasAuthority("USER_MANAGE")

                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/v1/movies/**")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers(HttpMethod.PUT, "/api/v1/movies/**")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers(HttpMethod.DELETE, "/api/v1/movies/**")
                        .hasAuthority("MOVIE_DELETE")

                        .requestMatchers(HttpMethod.GET, "/api/v1/shows/**")
                        .permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/v1/shows/**")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers(HttpMethod.PUT, "/api/v1/shows/**")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers(HttpMethod.DELETE, "/api/v1/shows/**")
                        .hasAuthority("MOVIE_DELETE")

                        .requestMatchers("/api/v1/admin/create")
                        .hasAuthority("SYSTEM_CONFIG")

                        .requestMatchers("/superadmin/**",
                                "/system/superadmin/**",
                                "/api/v1/system/superadmin/**")
                        .hasAuthority("SYSTEM_CONFIG")

                        .requestMatchers("/set-password/**",
                                "/api/v1/auth/set-password")
                        .permitAll()

                        .anyRequest().authenticated()
                )

                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives(
                                        "default-src 'self'; " +
                                                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                                                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                                "font-src 'self' https://fonts.gstatic.com; " +
                                                "img-src 'self' data: https: https://i.ibb.co https://api.imgbb.com; " +
                                                "media-src 'self' https: https://www.youtube.com https://jumpshare.com https://www.youtube-nocookie.com; " +
                                                "frame-src 'self' https: https://www.youtube.com https://jumpshare.com https://www.youtube-nocookie.com https://youtube.com; " +
                                                "connect-src 'self' https://movies-app-complete.vercel.app https://movieticket-api.onrender.com https://movies-admin-one.vercel.app https://api.themoviedb.org https://api.imgbb.com https://fonts.googleapis.com; " +
                                                "object-src 'none'; " +
                                                "frame-ancestors 'none'; " +
                                                "base-uri 'self';"
                                )
                        )
                        .xssProtection(HeadersConfigurer.XXssConfig::disable)
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                )

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(authenticationEntryPoint)
                );

        return http.build();
    }
}