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
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
        return new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED);
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
                .cors(cors -> {})  // Enable CORS from WebConfig
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(
                                "/api/v1/ping",
                                "/api/v1/auth/**",
                                "/api/v1/verify/email",
                                "/verify/email",
                                "/api/v1/validate/Otp",
                                "/api/password-reset/**",
                                "/pingSpring",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        .requestMatchers(
                                "/api/v1/movies/**",
                                "/api/v1/shows/**",
                                "/api/v1/products/**",
                                "/api/v1/about",
                                "/api/v1/test-data/status",
                                "/api/v1/tmdb/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/v1/profile/**",
                                "/api/v1/customers/currentUser",
                                "/api/v1/subscription/confirm",
                                "/api/v1/payments/**",
                                "/api/v1/video/**"
                        ).authenticated()

                        .requestMatchers(
                                "/api/v1/customers/**",
                                "/api/v1/roles/**"
                        ).hasAuthority("USER_MANAGE")

                        .requestMatchers("/api/v1/movies")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers("/api/v1/shows")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers("/api/v1/movies/**")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers("/api/v1/shows/**")
                        .hasAuthority("MOVIE_WRITE")

                        .requestMatchers("/api/v1/movies/**")
                        .hasAuthority("MOVIE_DELETE")

                        .requestMatchers("/api/v1/shows/**")
                        .hasAuthority("MOVIE_DELETE")

                        .requestMatchers("/api/v1/admin/create")
                        .hasAuthority("SYSTEM_CONFIG")

                        .anyRequest().authenticated()
                )

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(authenticationEntryPoint)
                );

        return http.build();
    }
}