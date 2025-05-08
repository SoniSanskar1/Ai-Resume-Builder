package com.resume.builder.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;

@Component
public class JwtUtil {

    private static final String SECRET = "my-super-secret-key-which-is-long-enough";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    private static final long JWT_EXPIRATION_MS = 1000 * 60 * 60; // 1 hour

    public String generateToken(String email) {
        System.out.println("Generate token: " + email);
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String refreshToken(String token) {
        try {
            // Extract claims without validating expiration for refresh
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            if (isTokenExpired(token)) {
                // Regenerate token with same subject (email)
                return generateToken(claims.getSubject());
            }
            return token; // Return original if not expired
        } catch (Exception e) {
            return null; // Invalid token
        }
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        System.out.println("Validate token: " + token);
        System.out.println("User details: " + userDetails.getUsername());
        System.out.println("isTokenExpired(token): " + isTokenExpired(token));

        final String email = extractEmail(token);
        System.out.println("Email: " + email);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}