package com.medinexus.organ.controller;

import com.medinexus.organ.dto.OrganDonorCreateRequest;
import com.medinexus.organ.dto.OrganDonorResponseDto;
import com.medinexus.organ.service.OrganDonorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organ-donors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class OrganDonorController {

    private final OrganDonorService organDonorService;

    // =========================================================
    // PATIENT - REGISTER AS ORGAN DONOR
    // =========================================================

    @PostMapping
    public OrganDonorResponseDto registerAsDonor(
            @Valid @RequestBody OrganDonorCreateRequest request,
            Authentication authentication
    ) {

        return organDonorService.registerAsDonor(
                request,
                authentication
        );
    }

    // =========================================================
    // PATIENT - VIEW MY DONATION STATUS
    // =========================================================

    @GetMapping("/my")
    public OrganDonorResponseDto getMyDonationStatus(
            Authentication authentication
    ) {

        return organDonorService.getMyDonationStatus(
                authentication
        );
    }
}