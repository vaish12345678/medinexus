package com.medinexus.hospital.controller;

import com.medinexus.hospital.dto.HospitalDoctorRequestDto;
import com.medinexus.hospital.dto.HospitalDoctorResponseDto;
import com.medinexus.hospital.service.HospitalDoctorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalDoctorController {

    private final HospitalDoctorService hospitalDoctorService;


    // =========================
    // ADD DOCTOR TO HOSPITAL
    // =========================

    @PostMapping("/{hospitalId}/doctors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDoctorResponseDto> addDoctor(
            @PathVariable Long hospitalId,
            @Valid @RequestBody HospitalDoctorRequestDto request
    ) {

        HospitalDoctorResponseDto response =
                hospitalDoctorService.addDoctor(
                        hospitalId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================
    // GET ALL HOSPITAL DOCTORS
    // =========================

    @GetMapping("/{hospitalId}/doctors")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalDoctorResponseDto>>
    getHospitalDoctors(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                hospitalDoctorService
                        .getHospitalDoctors(hospitalId)
        );
    }


    // =========================
    // GET ACTIVE HOSPITAL DOCTORS
    // =========================

    @GetMapping("/{hospitalId}/doctors/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalDoctorResponseDto>>
    getActiveHospitalDoctors(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                hospitalDoctorService
                        .getActiveHospitalDoctors(hospitalId)
        );
    }


    // =========================
    // GET DOCTORS BY DEPARTMENT
    // =========================

    @GetMapping("/hospital-departments/{departmentId}/doctors")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalDoctorResponseDto>>
    getDoctorsByDepartment(
            @PathVariable Long departmentId
    ) {

        return ResponseEntity.ok(
                hospitalDoctorService
                        .getDoctorsByDepartment(
                                departmentId
                        )
        );
    }


    // =========================
    // GET HOSPITAL DOCTOR BY ID
    // =========================

    @GetMapping("/hospital-doctors/{hospitalDoctorId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HospitalDoctorResponseDto>
    getHospitalDoctorById(
            @PathVariable Long hospitalDoctorId
    ) {

        return ResponseEntity.ok(
                hospitalDoctorService
                        .getHospitalDoctorById(
                                hospitalDoctorId
                        )
        );
    }


    // =========================
    // REMOVE DOCTOR
    // =========================

    @DeleteMapping("/{hospitalId}/doctors/{hospitalDoctorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> removeDoctor(
            @PathVariable Long hospitalId,
            @PathVariable Long hospitalDoctorId
    ) {

        hospitalDoctorService.removeDoctor(
                hospitalId,
                hospitalDoctorId
        );

        return ResponseEntity.ok(
                "Doctor removed from hospital successfully"
        );
    }


    // =========================
    // ACTIVATE DOCTOR
    // =========================

    @PutMapping("/{hospitalId}/doctors/{hospitalDoctorId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDoctorResponseDto>
    activateDoctor(
            @PathVariable Long hospitalId,
            @PathVariable Long hospitalDoctorId
    ) {

        return ResponseEntity.ok(
                hospitalDoctorService.activateDoctor(
                        hospitalId,
                        hospitalDoctorId
                )
        );
    }


    // =========================
    // DEACTIVATE DOCTOR
    // =========================

    @PutMapping("/{hospitalId}/doctors/{hospitalDoctorId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDoctorResponseDto>
    deactivateDoctor(
            @PathVariable Long hospitalId,
            @PathVariable Long hospitalDoctorId
    ) {

        return ResponseEntity.ok(
                hospitalDoctorService.deactivateDoctor(
                        hospitalId,
                        hospitalDoctorId
                )
        );
    }
}