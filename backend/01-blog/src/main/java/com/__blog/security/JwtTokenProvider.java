package com.__blog.security;

import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.__blog.exception.ApiException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
    private String secretKey = "";

    public JwtTokenProvider() {
        try {
            KeyGenerator key = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secret = key.generateKey();
            secretKey = Base64.getEncoder().encodeToString(secret.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            secretKey = "myDefaultSecretKeyForJWT1234567890abcdefghijklmnopqrstuvwxyz";
        }
    }

    public String generetToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", username);
        claims.put("create", new Date(System.currentTimeMillis()));
        claims.put("role", role);
        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder().claims()
                .add(claims)
                .expiration(new Date(System.currentTimeMillis() + Duration.ofHours(5).toMillis()))
                .and()
                .signWith(genereteKey())
                .compact();
    }

    public Claims getUsernameFromToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parser().verifyWith(genereteKey()).build()
                    .parseSignedClaims(token).getPayload();
        } catch (ApiException e) {
            claims = null;
        }
        return claims;
    }

    public String getRoleFromToken(String token) {
        Claims claims = getUsernameFromToken(token);
        return claims != null ? (String) claims.get("role") : null;
    }

    public boolean isTokenValid(String Token, UserDetails userDetails) {
        String username = getUsernameFromToken(Token).getSubject();
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(Token));
    }

    private boolean isTokenExpired(String token) {
        Date expiration = getUsernameFromToken(token).getExpiration();
        return expiration.before(new Date());
    }

    private SecretKey genereteKey() {
        byte[] converBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(converBytes);
    }
}
