package com.medinexus.prescription.controller;

import com.medinexus.prescription.dto.PrescriptionItemRequestDto;
import com.medinexus.prescription.dto.PrescriptionItemResponseDto;
import com.medinexus.prescription.dto.PrescriptionRequestDto;
import com.medinexus.prescription.dto.PrescriptionResponseDto;
import com.medinexus.prescription.service.PrescriptionService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final UserRepository userRepository;


    // ============================================================
    // CREATE PRESCRIPTION - DOCTOR ONLY
    // ============================================================

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionResponseDto> createPrescription(
            Authentication authentication,
            @Valid @RequestBody PrescriptionRequestDto dto
    ) {

        User user = getAuthenticatedUser(authentication);

        PrescriptionResponseDto response =
                prescriptionService.createPrescription(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ============================================================
    // ADD MEDICINE - DOCTOR ONLY
    // ============================================================

    @PostMapping("/items")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionItemResponseDto> addMedicine(
            Authentication authentication,
            @Valid @RequestBody PrescriptionItemRequestDto dto
    ) {

        User user = getAuthenticatedUser(authentication);

        PrescriptionItemResponseDto response =
                prescriptionService.addMedicineToPrescription(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ============================================================
    // GET PRESCRIPTION BY ID
    //
    // Patient -> only their prescription
    // Doctor  -> only their prescription
    // Admin   -> any prescription
    // ============================================================

    @GetMapping("/{prescriptionId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<PrescriptionResponseDto> getPrescription(
            Authentication authentication,
            @PathVariable Long prescriptionId
    ) {

        User user = getAuthenticatedUser(authentication);

        PrescriptionResponseDto response =
                prescriptionService.getPrescriptionById(
                        prescriptionId,
                        user.getId(),
                        user.getRole()
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // GET PRESCRIPTION MEDICINES
    //
    // Patient -> only medicines from their prescription
    // Doctor  -> only medicines from their prescription
    // Admin   -> any prescription medicines
    // ============================================================

    @GetMapping("/{prescriptionId}/items")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<List<PrescriptionItemResponseDto>>
    getPrescriptionItems(
            Authentication authentication,
            @PathVariable Long prescriptionId
    ) {

        User user = getAuthenticatedUser(authentication);

        List<PrescriptionItemResponseDto> items =
                prescriptionService.getPrescriptionItems(
                        prescriptionId,
                        user.getId(),
                        user.getRole()
                );

        return ResponseEntity.ok(items);
    }


    // ============================================================
    // GET MY PRESCRIPTIONS - PATIENT ONLY
    // ============================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PrescriptionResponseDto>>
    getMyPrescriptions(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        List<PrescriptionResponseDto> prescriptions =
                prescriptionService.getPatientPrescriptions(
                        user.getId()
                );

        return ResponseEntity.ok(prescriptions);
    }


    // ============================================================
    // GET DOCTOR PRESCRIPTIONS - DOCTOR ONLY
    // ============================================================

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PrescriptionResponseDto>>
    getDoctorPrescriptions(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        List<PrescriptionResponseDto> prescriptions =
                prescriptionService.getDoctorPrescriptions(
                        user.getId()
                );

        return ResponseEntity.ok(prescriptions);
    }


    // ============================================================
    // GET AUTHENTICATED USER
    // ============================================================

    private User getAuthenticatedUser(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }
}