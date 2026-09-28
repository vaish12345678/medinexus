package com.medinexus.admin.controller;

import com.medinexus.user.dto.HospitalProfileRequestDto;
import com.medinexus.user.dto.HospitalProfileResponseDto;
import com.medinexus.user.service.HospitalProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/hospitals")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminHospitalController {

    private final HospitalProfileService hospitalProfileService;

    // =========================================================
    // ADD HOSPITAL
    // =========================================================

    @PostMapping
    public HospitalProfileResponseDto createHospital(
            @RequestBody HospitalProfileRequestDto dto
    ) {

        return hospitalProfileService.createHospital(dto);
    }

    // =========================================================
    // GET ALL HOSPITALS
    // Includes active + inactive hospitals
    // =========================================================

    @GetMapping
    public List<HospitalProfileResponseDto> getAllHospitals() {

        return hospitalProfileService.getAllHospitals();
    }

    // =========================================================
    // GET HOSPITAL BY ID
    // =========================================================

    @GetMapping("/{id}")
    public HospitalProfileResponseDto getHospital(
            @PathVariable Long id
    ) {

        return hospitalProfileService.getHospitalById(id);
    }

    // =========================================================
    // UPDATE HOSPITAL
    // =========================================================

    @PutMapping("/{id}")
    public HospitalProfileResponseDto updateHospital(
            @PathVariable Long id,
            @RequestBody HospitalProfileRequestDto dto
    ) {

        return hospitalProfileService.updateHospital(
                id,
                dto
        );
    }

    // =========================================================
    // DEACTIVATE HOSPITAL
    // =========================================================

    @PutMapping("/{id}/deactivate")
    public HospitalProfileResponseDto deactivateHospital(
            @PathVariable Long id
    ) {

        return hospitalProfileService.deactivateHospital(id);
    }

    // =========================================================
    // ACTIVATE HOSPITAL
    // =========================================================

    @PutMapping("/{id}/activate")
    public HospitalProfileResponseDto activateHospital(
            @PathVariable Long id
    ) {

        return hospitalProfileService.activateHospital(id);
    }
}