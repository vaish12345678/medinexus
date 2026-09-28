package com.medinexus.ambulance.controller;

import com.medinexus.ambulance.dto.NearbyAmbulanceResponseDto;
import com.medinexus.ambulance.service.NearbyAmbulanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@RequiredArgsConstructor
public class NearbyAmbulanceController {

    private final NearbyAmbulanceService nearbyAmbulanceService;

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyAmbulanceResponseDto>> findNearbyAmbulances(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5") Double radiusInKm
    ) {

        List<NearbyAmbulanceResponseDto> ambulances =
                nearbyAmbulanceService.findNearbyAmbulances(
                        latitude,
                        longitude,
                        radiusInKm
                );

        return ResponseEntity.ok(ambulances);
    }
}