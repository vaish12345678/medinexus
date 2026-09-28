package com.medinexus.organ.controller;

import com.medinexus.organ.dto.OrganRequestResponseDto;
import com.medinexus.organ.service.OrganRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/organ-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorOrganRequestController {

    private final OrganRequestService organRequestService;


    // =========================================================
    // GET APPROVED ORGAN REQUESTS
    // =========================================================

    @GetMapping
    public List<OrganRequestResponseDto> getApprovedRequests() {

        return organRequestService
                .getApprovedRequestsForDoctors();
    }
}