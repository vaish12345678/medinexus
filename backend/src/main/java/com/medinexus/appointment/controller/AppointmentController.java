package com.medinexus.appointment.controller;

import com.medinexus.appointment.dto.AppointmentRequestDto;
import com.medinexus.appointment.dto.AppointmentResponseDto;
import com.medinexus.appointment.service.AppointmentService;
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
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;


    // =========================================================
    // CREATE APPOINTMENT
    // PATIENT ONLY
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            Authentication authentication,
            @Valid @RequestBody AppointmentRequestDto dto
    ) {

        User user = getAuthenticatedUser(authentication);

        AppointmentResponseDto appointment =
                appointmentService.createAppointment(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(appointment);
    }


    // =========================================================
    // GET MY APPOINTMENTS
    // PATIENT ONLY
    // =========================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(
                        user.getId()
                )
        );
    }


    // =========================================================
    // GET DOCTOR APPOINTMENTS
    // DOCTOR ONLY
    // =========================================================

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponseDto>> getDoctorAppointments(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                appointmentService.getDoctorAppointments(
                        user.getId()
                )
        );
    }


    // =========================================================
    // GET APPOINTMENT BY ID
    // PATIENT / DOCTOR / ADMIN
    //
    // Patient -> only their appointment
    // Doctor  -> only appointments assigned to them
    // Admin   -> any appointment
    // =========================================================

    @GetMapping("/{appointmentId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        AppointmentResponseDto appointment =
                appointmentService.getAppointmentById(
                        appointmentId,
                        user.getId(),
                        user.getRole()
                );

        return ResponseEntity.ok(appointment);
    }


    // =========================================================
    // CANCEL APPOINTMENT
    // PATIENT ONLY
    // =========================================================

    @PutMapping("/{appointmentId}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponseDto> cancelAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                appointmentService.cancelAppointment(
                        appointmentId,
                        user.getId()
                )
        );
    }


    // =========================================================
    // CONFIRM APPOINTMENT
    // DOCTOR ONLY
    // =========================================================

    @PutMapping("/{appointmentId}/confirm")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponseDto> confirmAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                appointmentService.confirmAppointment(
                        appointmentId,
                        user.getId()
                )
        );
    }


    // =========================================================
    // COMPLETE APPOINTMENT
    // DOCTOR ONLY
    // =========================================================

    @PutMapping("/{appointmentId}/complete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponseDto> completeAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                appointmentService.completeAppointment(
                        appointmentId,
                        user.getId()
                )
        );
    }


    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }
}