package com.naren.moviesapp.Network;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import reactor.util.annotation.NonNullApi;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.allowed.origins:}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Always include Vercel origins + local development
        String[] origins = getOrigins();
        for (int i = 0; i < origins.length; i++) {
            origins[i] = origins[i].trim();
        }

        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .exposedHeaders("Authorization", "Content-Disposition", "Set-Cookie")
                .maxAge(3600);
    }

    private String[] getOrigins() {
        String vercelOrigins = "https://movies-app-complete.vercel.app";
        String localOrigins = "http://localhost:3000,http://localhost:3001,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:5173";

        String allOrigins;
        if (allowedOrigins == null || allowedOrigins.trim().isEmpty()) {
            // Use default origins
            allOrigins = vercelOrigins + "," + localOrigins;
        } else {
            // Use environment variable + Vercel origins
            allOrigins = vercelOrigins + "," + allowedOrigins;
        }

        // Split comma-separated origins and trim whitespace
        String[] origins = allOrigins.split(",");
        return origins;
    }
}
