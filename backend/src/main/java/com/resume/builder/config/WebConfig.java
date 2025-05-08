package com.resume.builder.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")  // ✅ Your React frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")                 // ✅ Allow all REST methods
                        .allowedHeaders("*")                     // ✅ Accept all headers
                        .allowCredentials(true)                  // ✅ Required for cookies/auth headers
                        .exposedHeaders("Authorization");        // ✅ (Optional) Expose token headers if needed
            }
        };
    }
}
