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
    // CREATE PRESCRIPTION - DOCTOR
    // ============================================================

    @PostMapping
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
    // ADD MEDICINE - DOCTOR
    // ============================================================

    @PostMapping("/items")
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
    // ============================================================

    @GetMapping("/{prescriptionId}")
    public ResponseEntity<PrescriptionResponseDto> getPrescription(
            @PathVariable Long prescriptionId
    ) {

        PrescriptionResponseDto response =
                prescriptionService.getPrescriptionById(
                        prescriptionId
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // GET PRESCRIPTION MEDICINES
    // ============================================================

    @GetMapping("/{prescriptionId}/items")
    public ResponseEntity<List<PrescriptionItemResponseDto>>
    getPrescriptionItems(
            @PathVariable Long prescriptionId
    ) {

        List<PrescriptionItemResponseDto> items =
                prescriptionService.getPrescriptionItems(
                        prescriptionId
                );

        return ResponseEntity.ok(items);
    }


    // ============================================================
    // GET MY PRESCRIPTIONS - PATIENT
    // ============================================================

    @GetMapping("/my")
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
    // GET DOCTOR PRESCRIPTIONS
    // ============================================================

    @GetMapping("/doctor")
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