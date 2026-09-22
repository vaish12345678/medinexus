package com.medinexus.user.controller;

import com.medinexus.user.dto.HospitalProfileRequestDto;
import com.medinexus.user.dto.HospitalProfileResponseDto;
import com.medinexus.user.service.HospitalProfileService;
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
public class HospitalProfileController {

    private final HospitalProfileService hospitalService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalProfileResponseDto> createHospital(
            @Valid @RequestBody HospitalProfileRequestDto request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        hospitalService.createHospital(request)
                );
    }

    @PutMapping("/{hospitalId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalProfileResponseDto> updateHospital(
            @PathVariable Long hospitalId,
            @Valid @RequestBody HospitalProfileRequestDto request
    ) {

        return ResponseEntity.ok(
                hospitalService.updateHospital(
                        hospitalId,
                        request
                )
        );
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalProfileResponseDto>>
    getHospitals() {

        return ResponseEntity.ok(
                hospitalService.getActiveHospitals()
        );
    }

    @GetMapping("/{hospitalId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HospitalProfileResponseDto>
    getHospitalById(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                hospitalService.getHospitalById(hospitalId)
        );
    }

    @GetMapping("/city/{city}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalProfileResponseDto>>
    getHospitalsByCity(
            @PathVariable String city
    ) {

        return ResponseEntity.ok(
                hospitalService.getHospitalsByCity(city)
        );
    }

    @GetMapping("/emergency")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalProfileResponseDto>>
    getEmergencyHospitals() {

        return ResponseEntity.ok(
                hospitalService.getEmergencyHospitals()
        );
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HospitalProfileResponseDto>>
    getPendingHospitals() {

        return ResponseEntity.ok(
                hospitalService.getPendingHospitals()
        );
    }

    @PutMapping("/admin/{hospitalId}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalProfileResponseDto>
    verifyHospital(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                hospitalService.verifyHospital(hospitalId)
        );
    }

    @PutMapping("/admin/{hospitalId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalProfileResponseDto>
    rejectHospital(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                hospitalService.rejectHospital(hospitalId)
        );
    }

    @PutMapping("/admin/{hospitalId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateHospital(
            @PathVariable Long hospitalId
    ) {

        hospitalService.deactivateHospital(hospitalId);

        return ResponseEntity.ok(
                "Hospital deactivated successfully"
        );
    }

    @PutMapping("/admin/{hospitalId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateHospital(
            @PathVariable Long hospitalId
    ) {

        hospitalService.activateHospital(hospitalId);

        return ResponseEntity.ok(
                "Hospital activated successfully"
        );
    }
}