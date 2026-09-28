package com.medinexus.auth.controller;

import com.medinexus.auth.dto.*;
import com.medinexus.auth.service.AuthService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;


    // ============================
    // REGISTER
    // ============================

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        RegisterResponse response =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ============================
    // LOGIN
    // ============================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        String token = authService.login(request);


        // JWT COOKIE
        ResponseCookie cookie =
                ResponseCookie.from(
                                "medinexus_token",
                                token
                        )
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(Duration.ofDays(1))
                        .sameSite("Lax")
                        .build();


        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body(
                        new LoginResponse(
                                "Login successful"
                        )
                );
    }


    // ============================
    // CURRENT USER
    // ============================

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found"
                                )
                        );

        String role = user.getRole().name();

        UserResponse response =
                new UserResponse(
                        user.getId(),
                        user.getEmail(),
                        role
                );

        return ResponseEntity.ok(response);
    }


    // ============================
    // LOGOUT
    // ============================

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {

        ResponseCookie cookie =
                ResponseCookie.from(
                                "medinexus_token",
                                ""
                        )
                        .httpOnly(true)
                        .secure(false)
                        .path("/")
                        .maxAge(0)
                        .sameSite("Lax")
                        .build();

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        cookie.toString()
                )
                .body("Logout successful");
    }
}