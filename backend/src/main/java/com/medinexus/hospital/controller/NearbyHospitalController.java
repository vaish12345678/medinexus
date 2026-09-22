package com.medinexus.hospital.controller;

import com.medinexus.hospital.dto.NearbyHospitalResponseDto;
import com.medinexus.hospital.service.NearbyHospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class NearbyHospitalController {

    private final NearbyHospitalService nearbyHospitalService;

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyHospitalResponseDto>> findNearbyHospitals(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5") Double radiusInKm
    ) {

        List<NearbyHospitalResponseDto> hospitals =
                nearbyHospitalService.findNearbyHospitals(
                        latitude,
                        longitude,
                        radiusInKm
                );

        return ResponseEntity.ok(hospitals);
    }
}