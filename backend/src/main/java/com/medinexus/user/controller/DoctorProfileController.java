package com.medinexus.user.controller;

import com.medinexus.user.dto.DoctorProfileRequestDto;
import com.medinexus.user.dto.DoctorProfileResponseDto;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import com.medinexus.user.service.DoctorProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.DoctorProfileRepository;

@RestController
@RequestMapping("/api/doctors/profile")
@RequiredArgsConstructor
public class DoctorProfileController {

    private final DoctorProfileService doctorProfileService;
    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    // =========================================================
    // CREATE DOCTOR PROFILE
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileResponseDto> createProfile(
            Authentication authentication,
            @Valid @RequestBody DoctorProfileRequestDto dto) {

        User user = getAuthenticatedUser(authentication);

        DoctorProfileResponseDto response =
                doctorProfileService.createProfile(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // GET MY DOCTOR PROFILE
    // =========================================================

    @GetMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileResponseDto> getProfile(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                doctorProfileService.getProfile(user.getId())
        );
    }

    // =========================================================
    // UPDATE MY DOCTOR PROFILE
    // =========================================================

    @PutMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorProfileResponseDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody DoctorProfileRequestDto dto) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                doctorProfileService.updateProfile(
                        user.getId(),
                        dto
                )
        );
    }
    // =========================================================
// FIND DOCTORS BY SPECIALIZATION
// =========================================================

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<DoctorProfileResponseDto>> getDoctorsBySpecialization(
            @PathVariable String specialization) {

        return ResponseEntity.ok(
                doctorProfileService.getDoctorsBySpecialization(specialization)
        );
    }
    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}