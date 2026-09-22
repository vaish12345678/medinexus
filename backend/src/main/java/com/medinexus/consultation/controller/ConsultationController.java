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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;
    private final UserRepository userRepository;


    // Doctor creates consultation
    @PostMapping
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


    // Get consultation by ID
    @GetMapping("/{consultationId}")
    public ResponseEntity<ConsultationResponseDto> getConsultation(
            @PathVariable Long consultationId
    ) {

        ConsultationResponseDto response =
                consultationService.getConsultationById(
                        consultationId
                );

        return ResponseEntity.ok(response);
    }


    // Patient gets own consultations
    @GetMapping("/my")
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


    // Doctor gets own consultations
    @GetMapping("/doctor")
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


    // Doctor updates consultation
    @PutMapping("/{consultationId}")
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


    // Get currently authenticated user
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