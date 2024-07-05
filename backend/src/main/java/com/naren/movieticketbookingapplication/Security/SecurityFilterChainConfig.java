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
        log.info("Configuring custom Security Filter Chain...");
        http.csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/v1/verify/email", "/api/v1/validate/Otp")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/customers", "/api/v1/auth/admins",
                                "/api/v1/auth/login", "/api/v1/auth/loginAdmin")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/customers/byEmail",
                                "/api/v1/customers/byPhone", "/api/v1/customers/loggedIn/{isLoggedIn}",
                                "api/v1/customers/stats")
                        .permitAll()

                        // Admin-only endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/customers/roles")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/customers/{id}", "/api/v1/customers/byEmail",
                                "/api/v1/customers/byPhone", "/api/v1/customers",
                                "/api/v1/products/AllProducts", "/api/v1/roles")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/customers/{id}", "/api/v1/roles/{id}")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/customers/add-movie/{customerId}/{movieId}",
                                "/api/v1/customers/{id}", "/api/v1/customers/reset-pass/{id}",
                                "/api/v1/customers/products/{id}/{type}")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/customers/remove-movie/{customerId}/{movieId}",
                                "/api/v1/customers/{customerId}/remove-all-movies")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/roles")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/roles/{id}", "/api/v1/products/{id}/{type}")
                        .hasRole("ADMIN")

                        // MovieController endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/movies")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/{id}", "/api/v1/movies")
                        .permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/movies/{id}")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/movies/{id}")
                        .hasRole("ADMIN")

                        // ShowController endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/shows")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/v1/shows/{id}", "/api/v1/shows")
                        .permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/v1/shows/{id}")
                        .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/shows/{id}")
                        .hasRole("ADMIN")

                        // AuthController endpoints
                        .requestMatchers(HttpMethod.POST, "/auth/customers")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/admins")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login")
                        .permitAll()

                        // RegVerifyController endpoints
                        .requestMatchers(HttpMethod.POST, "/api/v1/verify/email")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/validate/Otp")
                        .permitAll()

                        .anyRequest().authenticated())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(handler -> handler.authenticationEntryPoint(authenticationEntryPoint));
        log.info("Custom Security Filter Chain configured successfully.");
        return http.build();
    }

}
