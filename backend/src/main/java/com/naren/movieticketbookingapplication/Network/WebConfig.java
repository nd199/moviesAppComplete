package com.naren.movieticketbookingapplication.Network;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
@Slf4j
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        log.info("Adding CORS");
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3006","http://localhost:5001",
                        "https://movies-app-complete.vercel.app/", "https://movies-app-complete-gmco.vercel.app/",
                        "https://movies-app-complete-payment.vercel.app/", "https://movieticket-api.onrender.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .exposedHeaders("Authorization", "Content-Disposition")
                .maxAge(3600);
    }
}
