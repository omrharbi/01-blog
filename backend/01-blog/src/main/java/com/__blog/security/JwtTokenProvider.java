package com.__blog.security;

import java.time.Duration;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
    
    // Use a fixed secret key - in production, put this in application.properties
    @Value("${jwt.secret:mySecretKeyForJWT1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789}")
    private String secretKey;
 
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", username);
        claims.put("create", new Date(System.currentTimeMillis()));
        claims.put("role", role);
        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .claims(claims)
                .expiration(new Date(System.currentTimeMillis() + Duration.ofHours(5).toMillis()))
                .signWith(generateKey(), Jwts.SIG.HS512)
                .compact();
    }

    public Claims getUsernameFromToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parser()
                    .verifyWith(generateKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT parsing error: " + e.getMessage());
            throw new RuntimeException("Invalid JWT token: " + e.getMessage(), e);
        }
        return claims;
    }

    public String getRoleFromToken(String token) {
        try {
            Claims claims = getUsernameFromToken(token);
            return claims != null ? (String) claims.get("role") : null;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT parsing error: " + e.getMessage());
            throw new RuntimeException("Invalid JWT token: " + e.getMessage(), e);
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token).getSubject();
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = getUsernameFromToken(token).getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    private SecretKey generateKey() {
        byte[] keyBytes = Decoders.BASE64.decode(Base64.getEncoder().encodeToString(secretKey.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }
}