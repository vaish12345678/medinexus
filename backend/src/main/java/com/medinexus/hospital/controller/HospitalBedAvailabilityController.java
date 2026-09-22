package com.medinexus.hospital.controller;

import com.medinexus.hospital.dto.HospitalBedAvailabilityRequestDto;
import com.medinexus.hospital.dto.HospitalBedAvailabilityResponseDto;
import com.medinexus.hospital.service.HospitalBedAvailabilityService;

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
public class HospitalBedAvailabilityController {

    private final HospitalBedAvailabilityService
            bedAvailabilityService;


    // =========================================================
    // ADD BED AVAILABILITY
    // =========================================================

    @PostMapping("/{hospitalId}/beds")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalBedAvailabilityResponseDto>
    addBedAvailability(
            @PathVariable Long hospitalId,
            @Valid @RequestBody
            HospitalBedAvailabilityRequestDto request
    ) {

        HospitalBedAvailabilityResponseDto response =
                bedAvailabilityService.addBedAvailability(
                        hospitalId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // UPDATE BED AVAILABILITY
    // =========================================================

    @PutMapping(
            "/{hospitalId}/beds/{availabilityId}"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalBedAvailabilityResponseDto>
    updateBedAvailability(
            @PathVariable Long hospitalId,
            @PathVariable Long availabilityId,
            @Valid @RequestBody
            HospitalBedAvailabilityRequestDto request
    ) {

        return ResponseEntity.ok(
                bedAvailabilityService.updateBedAvailability(
                        hospitalId,
                        availabilityId,
                        request
                )
        );
    }


    // =========================================================
    // GET ALL BEDS FOR HOSPITAL
    // =========================================================

    @GetMapping("/{hospitalId}/beds")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<
            List<HospitalBedAvailabilityResponseDto>>
    getHospitalBedAvailability(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                bedAvailabilityService
                        .getHospitalBedAvailability(hospitalId)
        );
    }


    // =========================================================
    // GET SINGLE BED AVAILABILITY RECORD
    // =========================================================

    @GetMapping("/hospital-beds/{availabilityId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HospitalBedAvailabilityResponseDto>
    getBedAvailabilityById(
            @PathVariable Long availabilityId
    ) {

        return ResponseEntity.ok(
                bedAvailabilityService
                        .getBedAvailabilityById(
                                availabilityId
                        )
        );
    }


    // =========================================================
    // DELETE BED AVAILABILITY
    // =========================================================

    @DeleteMapping(
            "/{hospitalId}/beds/{availabilityId}"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBedAvailability(
            @PathVariable Long hospitalId,
            @PathVariable Long availabilityId
    ) {

        bedAvailabilityService.deleteBedAvailability(
                hospitalId,
                availabilityId
        );

        return ResponseEntity.ok(
                "Bed availability record deleted successfully"
        );
    }


    // =========================================================
    // FIND AVAILABLE BEDS
    // =========================================================

    @GetMapping("/{hospitalId}/beds/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<
            List<HospitalBedAvailabilityResponseDto>>
    findAvailableBeds(
            @PathVariable Long hospitalId,
            @RequestParam(defaultValue = "1")
            Integer minimumAvailableBeds
    ) {

        return ResponseEntity.ok(
                bedAvailabilityService.findAvailableBeds(
                        hospitalId,
                        minimumAvailableBeds
                )
        );
    }
}