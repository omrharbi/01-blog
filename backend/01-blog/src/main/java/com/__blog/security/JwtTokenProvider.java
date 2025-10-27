package com.__blog.security;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

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
    @Value("${jwt.access-token-expiration}")
    private long jwtAccessExpiration;

  

    public String generateToken(String username, String role,UUID id) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("uuid", id);
        return createToken(claims, username, jwtAccessExpiration);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getPayloadFromToken(token);
        return claimsResolver.apply(claims);
    }
 

    public Claims getPayloadFromToken(String token) {
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
            Claims claims = getPayloadFromToken(token);
            return claims != null ? (String) claims.get("role") : null;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT parsing error: " + e.getMessage());
             return null;
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (ApiException e) {

            return false;
        } catch (Exception e) {
            System.err.println("JWT parsing error: " + e.getMessage());
            return false;
            // throw new ApiException("Token validation failed: " + e.getMessage(),
            // HttpStatus.UNAUTHORIZED);
        }
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(generateKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.before(new Date());
        } catch (ApiException e) {
            // If it's already an ApiException (like ExpiredJwtException), let it propagate
            return false;
        } catch (Exception e) {
            return true;
        }
    }

    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(generateKey(), Jwts.SIG.HS256)
                .compact();
    }

    private SecretKey generateKey() {
        byte[] keyBytes = Decoders.BASE64.decode(Base64.getEncoder().encodeToString(secretKey.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
