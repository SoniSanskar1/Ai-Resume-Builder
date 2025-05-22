package com.resume.builder.config;

import io.github.cdimascio.dotenv.Dotenv;

public class DotenvInitializer {
    static {
        Dotenv dotenv = Dotenv.configure()
                .directory("D:\\project\\ai-resume-builder\\backend") // path to your .env file
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}
