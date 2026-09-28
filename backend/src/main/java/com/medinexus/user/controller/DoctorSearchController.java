package com.medinexus.user.controller;

import com.medinexus.user.dto.DoctorProfileResponseDto;
import com.medinexus.user.service.DoctorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorSearchController {

    private final DoctorProfileService doctorProfileService;

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<DoctorProfileResponseDto>> getDoctorsBySpecialization(
            @PathVariable String specialization) {

        return ResponseEntity.ok(
                doctorProfileService.getDoctorsBySpecialization(specialization)
        );
    }
}