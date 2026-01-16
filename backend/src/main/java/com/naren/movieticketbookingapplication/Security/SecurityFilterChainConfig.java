package com.naren.movieticketbookingapplication.Security;

import com.naren.movieticketbookingapplication.jwt.JwtAuthFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@EnableWebSecurity
@Configuration
public class SecurityFilterChainConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthFilter authFilter;
    private final AuthenticationEntryPoint authenticationEntryPoint;


    public SecurityFilterChainConfig(AuthenticationProvider authenticationProvider, JwtAuthFilter authFilter,
                                     AuthenticationEntryPoint authenticationEntryPoint) {
        this.authenticationProvider = authenticationProvider;
        this.authFilter = authFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain customSecurityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        /* ================= PUBLIC ================= */

                        .requestMatchers(HttpMethod.GET,
                                "/ping",
                                "/api/v1/movies/**",
                                "/api/v1/shows/**",
                                "/api/v1/about"
                        ).permitAll()

                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/auth/**",
                                "/api/v1/verify/email",
                                "/api/v1/validate/Otp",
                                "/api/password-reset/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/subscription/intent"
                        ).permitAll()

                        /* ================= AUTHENTICATED ================= */

                        .requestMatchers(
                                "/api/v1/profile/**",
                                "/api/v1/customers/currentUser",
                                "/api/v1/subscription/confirm",

                                "/api/v1/video/**"
                        ).authenticated()

                        /* ================= ADMIN ================= */

                        .requestMatchers(
                                "/api/v1/customers/**",
                                "/api/v1/roles/**",
                                "/api/v1/products/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/movies",
                                "/api/v1/shows"
                        ).hasRole("ADMIN")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/movies/**",
                                "/api/v1/shows/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/movies/**",
                                "/api/v1/shows/**"
                        ).hasRole("ADMIN")

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
