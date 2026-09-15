package com.shreya.travelbooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Central CORS configuration.
 * Add any future deployed frontend origin to allowedOrigins() below —
 * no controller code needs to change when the frontend URL changes.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173" // React/Vite dev server
                        // add the deployed frontend URL here later, e.g.:
                        // "https://your-frontend.vercel.app" 
                ) 
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") 
                .allowedHeaders("*"); 
    } 
} 
