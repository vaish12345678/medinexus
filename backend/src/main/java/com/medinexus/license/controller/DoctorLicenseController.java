package com.medinexus.license.controller;

import com.medinexus.license.dto.DoctorLicenseResponseDto;
import com.medinexus.license.dto.DoctorLicenseVerificationDto;
import com.medinexus.license.service.DoctorLicenseService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/licenses")
@RequiredArgsConstructor
public class DoctorLicenseController {

    private final DoctorLicenseService doctorLicenseService;
    private final UserRepository userRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DoctorLicenseResponseDto> submitLicense(
            Authentication authentication,
            @RequestParam("licenseNumber") String licenseNumber,
            @RequestParam("document") MultipartFile document) {

        User user = getAuthenticatedUser(authentication);

        DoctorLicenseResponseDto response =
                doctorLicenseService.submitLicense(
                        user.getId(),
                        licenseNumber,
                        document
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<DoctorLicenseResponseDto>> getMyLicenses(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                doctorLicenseService.getDoctorLicenses(user.getId())
        );
    }

    @GetMapping("/{licenseId}")
    public ResponseEntity<DoctorLicenseResponseDto> getLicense(
            @PathVariable Long licenseId) {

        return ResponseEntity.ok(
                doctorLicenseService.getLicense(licenseId)
        );
    }

    @PutMapping("/{licenseId}/verify")
    public ResponseEntity<DoctorLicenseResponseDto> verifyLicense(
            @PathVariable Long licenseId,
            @Valid @RequestBody DoctorLicenseVerificationDto dto) {

        return ResponseEntity.ok(
                doctorLicenseService.verifyLicense(
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