package com.medinexus.consultation.controller;

import com.medinexus.consultation.dto.ConsultationRequestDto;
import com.medinexus.consultation.dto.ConsultationResponseDto;
import com.medinexus.consultation.service.ConsultationService;
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
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;
    private final UserRepository userRepository;


    // =========================================================
    // DOCTOR CREATES CONSULTATION
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ConsultationResponseDto> createConsultation(
            Authentication authentication,
            @Valid @RequestBody ConsultationRequestDto dto
    ) {

        User user = getAuthenticatedUser(authentication);

        ConsultationResponseDto response =
                consultationService.createConsultation(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET CONSULTATION BY ID
    //
    // Patient -> only their consultation
    // Doctor  -> only their consultation
    // Admin   -> any consultation
    // =========================================================

    @GetMapping("/{consultationId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<ConsultationResponseDto> getConsultation(
            Authentication authentication,
            @PathVariable Long consultationId
    ) {

        User user = getAuthenticatedUser(authentication);

        ConsultationResponseDto response =
                consultationService.getConsultationById(
                        consultationId,
                        user.getId(),
                        user.getRole()
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // PATIENT GETS OWN CONSULTATIONS
    // =========================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<ConsultationResponseDto>>
    getMyConsultations(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        List<ConsultationResponseDto> consultations =
                consultationService.getPatientConsultations(
                        user.getId()
                );

        return ResponseEntity.ok(consultations);
    }


    // =========================================================
    // DOCTOR GETS OWN CONSULTATIONS
    // =========================================================

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<ConsultationResponseDto>>
    getDoctorConsultations(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        List<ConsultationResponseDto> consultations =
                consultationService.getDoctorConsultations(
                        user.getId()
                );

        return ResponseEntity.ok(consultations);
    }


    // =========================================================
    // DOCTOR UPDATES CONSULTATION
    // =========================================================

    @PutMapping("/{consultationId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ConsultationResponseDto>
    updateConsultation(
            Authentication authentication,
            @PathVariable Long consultationId,
            @Valid @RequestBody ConsultationRequestDto dto
    ) {

        User user = getAuthenticatedUser(authentication);

        ConsultationResponseDto response =
                consultationService.updateConsultation(
                        consultationId,
                        user.getId(),
                        dto
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

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