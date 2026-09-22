package com.medinexus.user.controller;

import com.medinexus.user.dto.PatientProfileRequestDto;
import com.medinexus.user.dto.PatientProfileResponseDto;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import com.medinexus.user.service.PatientProfileService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
public class PatientProfileController {

    private final PatientProfileService patientProfileService;
    private final UserRepository userRepository;

    public PatientProfileController(
            PatientProfileService patientProfileService,
            UserRepository userRepository) {

        this.patientProfileService = patientProfileService;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE PATIENT PROFILE
    // =========================================================

    @PostMapping("/profile")
    public ResponseEntity<PatientProfileResponseDto> createProfile(
            Authentication authentication,
            @Valid @RequestBody PatientProfileRequestDto dto) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientProfileResponseDto response =
                patientProfileService.createProfile(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET PATIENT PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<PatientProfileResponseDto> getProfile(
            Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientProfileResponseDto response =
                patientProfileService.getProfile(user.getId());

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // UPDATE PATIENT PROFILE
    // =========================================================

    @PutMapping("/profile")
    public ResponseEntity<PatientProfileResponseDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody PatientProfileRequestDto dto) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientProfileResponseDto response =
                patientProfileService.updateProfile(
                        user.getId(),
                        dto
                );

        return ResponseEntity.ok(response);
    }
}