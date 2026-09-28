package com.medinexus.organ.controller;

import com.medinexus.organ.dto.OrganRequestCreateRequest;
import com.medinexus.organ.dto.OrganRequestResponseDto;
import com.medinexus.organ.service.OrganRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organ-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class OrganRequestController {

    private final OrganRequestService organRequestService;


    // =========================================================
    // CREATE ORGAN REQUEST
    // =========================================================

    @PostMapping
    public OrganRequestResponseDto createRequest(
            @Valid @RequestBody OrganRequestCreateRequest request,
            Authentication authentication
    ) {

        return organRequestService.createRequest(
                request,
                authentication
        );
    }


    // =========================================================
    // GET MY ORGAN REQUESTS
    // =========================================================

    @GetMapping("/my")
    public List<OrganRequestResponseDto> getMyRequests(
            Authentication authentication
    ) {

        return organRequestService.getMyRequests(
                authentication
        );
    }
}