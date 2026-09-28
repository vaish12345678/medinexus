package com.medinexus.license.controller;

import com.medinexus.license.dto.PharmacyLicenseResponseDto;
import com.medinexus.license.dto.PharmacyLicenseVerificationDto;
import com.medinexus.license.entity.PharmacyLicense;
import com.medinexus.license.repository.PharmacyLicenseRepository;
import com.medinexus.license.service.PharmacyLicenseService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy/licenses")
@RequiredArgsConstructor
public class PharmacyLicenseController {

    private final PharmacyLicenseService pharmacyLicenseService;
    private final UserRepository userRepository;
    private final PharmacyLicenseRepository pharmacyLicenseRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyLicenseResponseDto> submitLicense(
            Authentication authentication,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam("document") MultipartFile document) {

        User user = getAuthenticatedUser(authentication);

        PharmacyLicenseResponseDto response =
                pharmacyLicenseService.submitLicense(
                        user.getId(),
                        licenseNumber,
                        document
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<PharmacyLicenseResponseDto>> getMyLicenses(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                pharmacyLicenseService.getMyLicenses(user.getId())
        );
    }

    @GetMapping("/{licenseId}")
    @PreAuthorize("hasRole('PHARMACY') or hasRole('ADMIN')")
    public ResponseEntity<PharmacyLicenseResponseDto> getLicense(
            @PathVariable Long licenseId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        boolean isAdmin = user.getRole().name().equals("ADMIN");

        return ResponseEntity.ok(
                pharmacyLicenseService.getLicense(
                        licenseId,
                        user.getId(),
                        isAdmin
                )
        );
    }
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PharmacyLicenseResponseDto>> getPendingLicenses() {

        return ResponseEntity.ok(
                pharmacyLicenseService.getPendingLicenses()
        );
    }

    @PutMapping("/{licenseId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PharmacyLicenseResponseDto> verifyLicense(
            @PathVariable Long licenseId,
            @Valid @RequestBody PharmacyLicenseVerificationDto dto) {

        return ResponseEntity.ok(
                pharmacyLicenseService.verifyLicense(
                        licenseId,
                        dto
                )
        );
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}