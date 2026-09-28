package com.medinexus.user.controller;

import com.medinexus.user.dto.HospitalProfileRequestDto;
import com.medinexus.user.dto.HospitalProfileResponseDto;
import com.medinexus.user.service.HospitalProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalProfileController {

    private final HospitalProfileService hospitalService;

    // =========================================================
    // CREATE HOSPITAL
    // Admin creates hospital
    // =========================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalProfileResponseDto createHospital(
            @RequestBody HospitalProfileRequestDto dto
    ) {
        return hospitalService.createHospital(dto);
    }

    // =========================================================
    // GET ALL HOSPITALS
    // Admin can see active + inactive hospitals
    // =========================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<HospitalProfileResponseDto> getAllHospitals() {

        return hospitalService.getAllHospitals();
    }

    // =========================================================
    // GET HOSPITAL BY ID
    // =========================================================

    @GetMapping("/{hospitalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalProfileResponseDto getHospital(
            @PathVariable Long hospitalId
    ) {

        return hospitalService.getHospitalById(hospitalId);
    }

    // =========================================================
    // UPDATE HOSPITAL
    // =========================================================

    @PutMapping("/{hospitalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalProfileResponseDto updateHospital(
            @PathVariable Long hospitalId,
            @RequestBody HospitalProfileRequestDto dto
    ) {

        return hospitalService.updateHospital(
                hospitalId,
                dto
        );
    }

    // =========================================================
    // ACTIVATE HOSPITAL
    // =========================================================

    @PutMapping("/{hospitalId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalProfileResponseDto activateHospital(
            @PathVariable Long hospitalId
    ) {

        return hospitalService.activateHospital(
                hospitalId
        );
    }

    // =========================================================
    // DEACTIVATE HOSPITAL
    // =========================================================

    @PutMapping("/{hospitalId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public HospitalProfileResponseDto deactivateHospital(
            @PathVariable Long hospitalId
    ) {

        return hospitalService.deactivateHospital(
                hospitalId
        );
    }

    // =========================================================
    // ACTIVE HOSPITALS
    // Used by patient-side hospital discovery
    // =========================================================

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public List<HospitalProfileResponseDto> getActiveHospitals() {

        return hospitalService.getActiveHospitals();
    }

    // =========================================================
    // HOSPITALS BY CITY
    // =========================================================

    @GetMapping("/city/{city}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public List<HospitalProfileResponseDto> getHospitalsByCity(
            @PathVariable String city
    ) {

        return hospitalService.getHospitalsByCity(city);
    }

    // =========================================================
    // EMERGENCY HOSPITALS
    // =========================================================

    @GetMapping("/emergency")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public List<HospitalProfileResponseDto> getEmergencyHospitals() {

        return hospitalService.getEmergencyHospitals();
    }
}