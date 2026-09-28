package com.medinexus.NearbyBlood.controller;

import com.medinexus.NearbyBlood.dto.NearbyBloodBankResponseDto;
import com.medinexus.NearbyBlood.service.NearbyBloodBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-banks")
@RequiredArgsConstructor
public class NearbyBloodBankController {

    private final NearbyBloodBankService nearbyBloodBankService;

    @GetMapping("/nearby")
    public ResponseEntity<List<NearbyBloodBankResponseDto>> findNearbyBloodBanks(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "5") Double radiusInKm
    ) {

        List<NearbyBloodBankResponseDto> bloodBanks =
                nearbyBloodBankService.findNearbyBloodBanks(
                        latitude,
                        longitude,
                        radiusInKm
                );

        return ResponseEntity.ok(bloodBanks);
    }
}