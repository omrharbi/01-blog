package com.__blog.controller.auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
public class RefreshTokenController {

    // @Autowired
    // private RefreshTokenService tokenService;

    // @PostMapping("/refreshtoken")
    // public ResponseEntity<?> refresheToken(@Valid @RequestBody RefreshTokenRequest request) {
    //     try {
    //         var token = tokenService.refreshAccessToken(request.getRefreshToken());

    //         return ResponseEntity.ok(token);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.badRequest().body(e);
    //     }
    // }
}
