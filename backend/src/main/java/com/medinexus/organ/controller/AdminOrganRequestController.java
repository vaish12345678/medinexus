package com.medinexus.organ.controller;

import com.medinexus.organ.dto.OrganRequestResponseDto;
import com.medinexus.organ.service.OrganRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/organ-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrganRequestController {

    private final OrganRequestService organRequestService;


    // =========================================================
    // GET ALL ORGAN REQUESTS
    // =========================================================

    @GetMapping
    public List<OrganRequestResponseDto> getAllRequests() {

        return organRequestService.getAllRequestsForAdmin();
    }


    // =========================================================
    // APPROVE REQUEST
    // =========================================================

    @PutMapping("/{id}/approve")
    public OrganRequestResponseDto approveRequest(
            @PathVariable Long id
    ) {

        return organRequestService.approveRequest(id);
    }


    // =========================================================
    // REJECT REQUEST
    // =========================================================

    @PutMapping("/{id}/reject")
    public OrganRequestResponseDto rejectRequest(
            @PathVariable Long id
    ) {

        return organRequestService.rejectRequest(id);
    }
}