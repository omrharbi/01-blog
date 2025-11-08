package com.__blog.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.__blog.service.UserDeService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtproProvider;
    @Autowired
    private UserDeService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        // List of public endpoints that don't require authentication

        String requestPublic = request.getRequestURI();
        if (isPublicEndpoint(requestPublic)) {
            filterChain.doFilter(request, response);
            return;
        }
        // Only validate token if it's a protected endpoint

        try {

            String header = request.getHeader("Authorization");
            SecurityContext sc = SecurityContextHolder.getContext();// for check if user already have authenticate
            if (header == null || !header.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }
            String token = header.substring(7).trim();
            if (token.isEmpty()) {
                System.err.println("this token is null");
                return;
            }
            Claims claims = jwtproProvider.getPayloadFromToken(token);
            if (claims == null) {
                sendErrorResponse(response, "Invalid JWT token. Please login again.");
                return;

            }

            String username = claims.getSubject();
            if (username == null) {
                sendErrorResponse(response, "Invalid JWT token. Please login again.");
                return;
            }
            if (sc.getAuthentication() == null) {

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtproProvider.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }

            }
            filterChain.doFilter(request, response);
            // }
        } catch (ServletException | IOException e) {
            sendErrorResponse(response, e.toString());
            // return;
        }

    }

    private boolean isPublicEndpoint(String requestPath) {
        return "/auth/login".equals(requestPath) ||
                "/auth/register".equals(requestPath) ||
                "/api/posts/getallPost".equals(requestPath) ||
                requestPath.startsWith("/api/posts/getPostById/")||///
                requestPath.startsWith("/api/comment/getCommentsWithPost")||///
                "/uploads/**".equals(requestPath) ||
                "/ws/**".equals(requestPath);
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }

}
