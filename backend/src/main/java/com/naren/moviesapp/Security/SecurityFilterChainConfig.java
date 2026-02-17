package com.naren.moviesapp.Security;

import com.naren.moviesapp.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
@EnableMethodSecurity
public class SecurityFilterChainConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder encoder) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(encoder);
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new HttpStatusEntryPoint(HttpStatus.FORBIDDEN);
    }

    @Bean
    public SecurityFilterChain customSecurityFilterChain(HttpSecurity http,
                                                         AuthenticationProvider authenticationProvider,
                                                         JwtAuthFilter authFilter,
                                                         AuthenticationEntryPoint authenticationEntryPoint) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)

                .cors(cors -> cors.configure(http))

                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        /* ================= PUBLIC ================= */

                        .requestMatchers(HttpMethod.GET,
                                "/api/v1/ping",
                                "/api/v1/movies/**",
                                "/api/v1/shows/**",
                                "/api/v1/products/**",
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

                        // Swagger UI endpoints
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        /* ================= AUTHENTICATED ================= */

                        .requestMatchers(
                                "/api/v1/profile/**",
                                "/api/v1/customers/currentUser",
                                "/api/v1/subscription/confirm",
                                "/api/v1/payments/**",
                                "/api/v1/video/**"
                        ).authenticated()

                        /* ================= ADMIN ================= */

                        .requestMatchers(
                                "/api/v1/customers/**",
                                "/api/v1/roles/**"
                        ).hasAnyRole("ADMIN", "SUPER_ADMIN")

                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/movies",
                                "/api/v1/shows"
                        ).hasAnyRole("ADMIN", "SUPER_ADMIN")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/v1/movies/**",
                                "/api/v1/shows/**"
                        ).hasAnyRole("ADMIN", "SUPER_ADMIN")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/v1/movies/**",
                                "/api/v1/shows/**"
                        ).hasAnyRole("ADMIN", "SUPER_ADMIN")

                        /* ================= SUPER ADMIN ================= */

                        .requestMatchers(HttpMethod.POST,
                                "/api/v1/admin/create"
                        ).hasRole("SUPER_ADMIN")

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
