package com.medinexus.hospital.controller;

import com.medinexus.hospital.dto.HospitalSchemeResponse;
import com.medinexus.hospital.service.HospitalSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital-schemes")
@RequiredArgsConstructor
public class HospitalSchemeController {

    private final HospitalSchemeService hospitalSchemeService;

    @GetMapping
    public List<HospitalSchemeResponse> getActiveSchemes() {
        return hospitalSchemeService.getActiveSchemes();
    }

    @GetMapping("/{id}")
    public HospitalSchemeResponse getSchemeById(
            @PathVariable Long id) {

        return hospitalSchemeService.getSchemeById(id);
    }
}