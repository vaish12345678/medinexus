package com.medinexus.controller;

import com.medinexus.service.NearbyAmbulanceService;
import com.medinexus.dto.NearbyAmbulanceResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@RequiredArgsConstructor
public class NearbyAmbulanceController {

    private final NearbyAmbulanceService nearbyAmbulanceService;

    @GetMapping("/nearby")
    @PreAuthorize("hasRole('PATIENT')")
    public List<NearbyAmbulanceResponseDto> findNearbyAmbulances(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "10") Double radius
    ) {

        return nearbyAmbulanceService.findNearbyAmbulances(
                latitude,
                longitude,
                radius
        );
    }
}