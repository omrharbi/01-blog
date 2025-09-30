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

import com.__blog.exception.ApiException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
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
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token has expired. Please login again.");
            return null;
            // throw new ApiException("JWT token has expired. Please login again.",
            // HttpStatus.UNAUTHORIZED);
        } catch (SignatureException e) {
            System.out.println("Invalid JWT signature. Token may have been tampered ");
            return null;
            // throw new ApiException("Invalid JWT signature. Token may have been tampered
            // with.", HttpStatus.UNAUTHORIZED);
        } catch (JwtException e) {
            System.out.println("Invalid JWT token: ");
            return null;
            // throw new ApiException("Invalid JWT token: " + e.getMessage(),
            // HttpStatus.UNAUTHORIZED);
        } catch (IllegalArgumentException e) {
            System.out.println("JWT token is malformed or empty.");
            return null;
            // throw new ApiException("JWT token is malformed or empty.",
            // HttpStatus.BAD_REQUEST);
        }
        return claims;
    }

    public String getRoleFromToken(String token) {
        try {
            Claims claims = getUsernameFromToken(token);
            return claims != null ? (String) claims.get("role") : null;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT parsing error: " + e.getMessage());
            // throw new RuntimeException("Invalid JWT token: " + e.getMessage(), e);
            return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = getUsernameFromToken(token).getSubject();
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (ApiException e) {
            // Re-throw ApiException to be handled by GlobalExceptionHandler
            // throw e;
            return false;
        } catch (Exception e) {
            System.err.println("JWT parsing error: " + e.getMessage());
            return false;
            // throw new ApiException("Token validation failed: " + e.getMessage(),
            // HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = getUsernameFromToken(token).getExpiration();
            return expiration.before(new Date());
        } catch (ApiException e) {
            // If it's already an ApiException (like ExpiredJwtException), let it propagate
            return false;
        } catch (Exception e) {
            return true;
        }
    }

    private SecretKey generateKey() {
        byte[] keyBytes = Decoders.BASE64.decode(Base64.getEncoder().encodeToString(secretKey.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }
}