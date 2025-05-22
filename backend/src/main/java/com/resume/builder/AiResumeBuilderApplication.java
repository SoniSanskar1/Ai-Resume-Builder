package com.resume.builder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.resume.builder.config.DotenvInitializer;

@SpringBootApplication
public class AiResumeBuilderApplication {
    public static void main(String[] args) {
        DotenvInitializer dotenv = new DotenvInitializer();
        SpringApplication.run(AiResumeBuilderApplication.class, args);
    }
}
