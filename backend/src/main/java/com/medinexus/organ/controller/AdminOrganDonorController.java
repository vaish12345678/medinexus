package com.medinexus.organ.controller;

import com.medinexus.organ.dto.OrganDonorResponseDto;
import com.medinexus.organ.service.OrganDonorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/organ-donors")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrganDonorController {

    private final OrganDonorService organDonorService;

    // =========================================================
    // ADMIN - VIEW ALL DONORS
    // =========================================================

    @GetMapping
    public List<OrganDonorResponseDto> getAllDonors() {
        return organDonorService.getAllDonors();
    }

    // =========================================================
    // ADMIN - APPROVE PENDING DONOR
    // =========================================================

    @PutMapping("/{id}/approve")
    public OrganDonorResponseDto approveDonor(
            @PathVariable Long id
    ) {
        return organDonorService.approveDonor(id);
    }

    // =========================================================
    // ADMIN - REJECT PENDING DONOR
    // =========================================================

    @PutMapping("/{id}/reject")
    public OrganDonorResponseDto rejectDonor(
            @PathVariable Long id
    ) {
        return organDonorService.rejectDonor(id);
    }

    // =========================================================
    // ADMIN - ACTIVATE APPROVED DONOR
    // =========================================================

    @PutMapping("/{id}/activate")
    public OrganDonorResponseDto activateDonor(
            @PathVariable Long id
    ) {
        return organDonorService.activateDonor(id);
    }

    // =========================================================
    // ADMIN - WITHDRAW ACTIVE DONOR
    // =========================================================

    @PutMapping("/{id}/withdraw")
    public OrganDonorResponseDto withdrawDonor(
            @PathVariable Long id
    ) {
        return organDonorService.withdrawDonor(id);
    }
}