package com.resume.builder.filter;

import com.resume.builder.service.CustomUserDetailsService;
import com.resume.builder.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        System.out.println("authHeader: " + authHeader);
        ;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(token);
                System.out.println("email: " + email);
                System.out.println("jwtUtil.isTokenExpired(token): " + jwtUtil.isTokenExpired(token));
                if (jwtUtil.isTokenExpired(token)) {
                    String newToken = jwtUtil.refreshToken(token);
                    if (newToken != null) {
                        response.setHeader("Authorization", "Bearer " + newToken);
                        token = newToken;
                        email = jwtUtil.extractEmail(newToken);
                    } else {
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "Token expired and refresh failed");
                        return;
                    }
                }
            } catch (Exception e) {
                System.out.println("Invalid JWT Token: " + e.getMessage());
            }
        }

        System.out.println("get authentication: " + SecurityContextHolder.getContext().getAuthentication());
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

            System.out.println("jwtUtil.validateToken(token, userDetails): " + jwtUtil.validateToken(token, userDetails));
            if (jwtUtil.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}