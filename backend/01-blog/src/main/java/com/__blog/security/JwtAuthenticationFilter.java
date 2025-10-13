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

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtproProvider;
    @Autowired
    private UserDeService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {

            String header = request.getHeader("Authorization");
            SecurityContext sc = SecurityContextHolder.getContext();// for check if user already have authenticate
            if (header == null || !header.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }
            String token = header.substring(7).trim();
            if (token.isEmpty() ) {
                 System.err.println("this token is null");
                return;
            }
            String username = jwtproProvider.getPayloadFromToken(token).getSubject();
            if (username == null) {
                System.err.println("Invalid JWT token: " + token);
                
            } 
              if (username != null && sc.getAuthentication() == null) {
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
            handleJwtException(response, e);
            // return;
        }

    }

    private void handleJwtException(HttpServletResponse response, Exception e) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String message;

        if (e.getMessage().contains("Compact JWT strings may not contain whitespace")) {
            message = "Invalid JWT token format";
        } else if (e.getMessage().contains("JWT expired") || e.getMessage().contains("expired")) {
            message = "JWT token has expired";
        } else if (e.getMessage().contains("JWT signature") || e.getMessage().contains("signature")) {
            message = "Invalid JWT signature";
        } else if (e.getMessage().contains("malformed") || e.getMessage().contains("Malformed")) {
            message = "Malformed JWT token";
        } else {
            message = "JWT authentication failed";
        }

        String jsonResponse = String.format(
                "{\"error\":\"Unauthorized\",\"message\":\"%s\",\"status\":401,\"timestamp\":\"%s\"}",
                message, new java.util.Date());

        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }

}
