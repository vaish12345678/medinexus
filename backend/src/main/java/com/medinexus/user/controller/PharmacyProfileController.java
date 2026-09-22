package com.medinexus.user.controller;

import com.medinexus.user.dto.PharmacyProfileRequestDto;
import com.medinexus.user.dto.PharmacyProfileResponseDto;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import com.medinexus.user.service.PharmacyProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacies")
@RequiredArgsConstructor
public class PharmacyProfileController {

    private final PharmacyProfileService pharmacyProfileService;
    private final UserRepository userRepository;


    // ==========================================
    // CREATE PHARMACY PROFILE
    // ==========================================

    @PostMapping("/profile")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyProfileResponseDto> createProfile(
            @Valid @RequestBody PharmacyProfileRequestDto request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        PharmacyProfileResponseDto response =
                pharmacyProfileService.createProfile(
                        user.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==========================================
    // GET MY PROFILE
    // ==========================================

    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyProfileResponseDto> getMyProfile(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        PharmacyProfileResponseDto response =
                pharmacyProfileService.getMyProfile(
                        user.getId()
                );

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // GET VERIFIED PHARMACIES
    // ==========================================

    @GetMapping("/verified")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PharmacyProfileResponseDto>>
    getVerifiedPharmacies() {

        return ResponseEntity.ok(
                pharmacyProfileService.getVerifiedPharmacies()
        );
    }


    // ==========================================
    // GET PHARMACY BY ID
    // ==========================================

    @GetMapping("/{pharmacyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PharmacyProfileResponseDto> getProfileById(
            @PathVariable Long pharmacyId
    ) {

        return ResponseEntity.ok(
                pharmacyProfileService.getProfileById(pharmacyId)
        );
    }


    // ==========================================
    // ADMIN - PENDING PHARMACIES
    // ==========================================

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PharmacyProfileResponseDto>>
    getPendingPharmacies() {

        return ResponseEntity.ok(
                pharmacyProfileService.getPendingPharmacies()
        );
    }


    // ==========================================
    // ADMIN - VERIFY PHARMACY
    // ==========================================

    @PutMapping("/admin/{pharmacyId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PharmacyProfileResponseDto>
    verifyPharmacy(
            @PathVariable Long pharmacyId
    ) {

        return ResponseEntity.ok(
                pharmacyProfileService.verifyPharmacy(
                        pharmacyId
                )
        );
    }


    // ==========================================
    // ADMIN - REJECT PHARMACY
    // ==========================================

    @PutMapping("/admin/{pharmacyId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PharmacyProfileResponseDto>
    rejectPharmacy(
            @PathVariable Long pharmacyId
    ) {

        return ResponseEntity.ok(
                pharmacyProfileService.rejectPharmacy(
                        pharmacyId
                )
        );
    }
}