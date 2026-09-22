package com.medinexus.appointment.controller;

import com.medinexus.appointment.dto.AppointmentRequestDto;
import com.medinexus.appointment.dto.AppointmentResponseDto;
import com.medinexus.appointment.service.AppointmentService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public AppointmentController(
            AppointmentService appointmentService,
            UserRepository userRepository
    ) {
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    // ============================================================
    // CREATE APPOINTMENT - PATIENT
    // ============================================================

    @PostMapping
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            Authentication authentication,
            @Valid @RequestBody AppointmentRequestDto dto
    ) {

        User user = getAuthenticatedUser(authentication);

        AppointmentResponseDto response =
                appointmentService.createAppointment(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ============================================================
    // GET MY APPOINTMENTS - PATIENT
    // ============================================================

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        List<AppointmentResponseDto> appointments =
                appointmentService.getPatientAppointments(
                        user.getId()
                );

        return ResponseEntity.ok(appointments);
    }

    // ============================================================
    // GET DOCTOR'S APPOINTMENTS
    // ============================================================

    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentResponseDto>> getDoctorAppointments(
            Authentication authentication
    ) {

        User user = getAuthenticatedUser(authentication);

        List<AppointmentResponseDto> appointments =
                appointmentService.getDoctorAppointments(
                        user.getId()
                );

        return ResponseEntity.ok(appointments);
    }

    // ============================================================
    // GET APPOINTMENT BY ID
    // ============================================================

    @GetMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(
            @PathVariable Long appointmentId
    ) {

        AppointmentResponseDto appointment =
                appointmentService.getAppointmentById(
                        appointmentId
                );

        return ResponseEntity.ok(appointment);
    }

    // ============================================================
    // CANCEL APPOINTMENT - PATIENT
    // ============================================================

    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<AppointmentResponseDto> cancelAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        AppointmentResponseDto response =
                appointmentService.cancelAppointment(
                        appointmentId,
                        user.getId()
                );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // CONFIRM APPOINTMENT - DOCTOR
    // ============================================================

    @PutMapping("/{appointmentId}/confirm")
    public ResponseEntity<AppointmentResponseDto> confirmAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        AppointmentResponseDto response =
                appointmentService.confirmAppointment(
                        appointmentId,
                        user.getId()
                );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // COMPLETE APPOINTMENT - DOCTOR
    // ============================================================

    @PutMapping("/{appointmentId}/complete")
    public ResponseEntity<AppointmentResponseDto> completeAppointment(
            Authentication authentication,
            @PathVariable Long appointmentId
    ) {

        User user = getAuthenticatedUser(authentication);

        AppointmentResponseDto response =
                appointmentService.completeAppointment(
                        appointmentId,
                        user.getId()
                );

        return ResponseEntity.ok(response);
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