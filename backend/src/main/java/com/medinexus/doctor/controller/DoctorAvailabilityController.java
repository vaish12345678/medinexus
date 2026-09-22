package com.medinexus.doctor.controller;

import com.medinexus.doctor.dto.DoctorAvailabilityRequestDto;
import com.medinexus.doctor.dto.DoctorAvailabilityResponseDto;
import com.medinexus.doctor.service.DoctorAvailabilityService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors/availability")
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<DoctorAvailabilityResponseDto> addAvailability(
            Authentication authentication,
            @Valid @RequestBody DoctorAvailabilityRequestDto dto) {

        User user = getAuthenticatedUser(authentication);

        DoctorAvailabilityResponseDto response =
                availabilityService.addAvailability(
                        user.getId(),
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<DoctorAvailabilityResponseDto>>
    getMyAvailability(Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                availabilityService.getMyAvailability(user.getId())
        );
    }

    @DeleteMapping("/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(
            Authentication authentication,
            @PathVariable Long availabilityId) {

        User user = getAuthenticatedUser(authentication);

        availabilityService.deleteAvailability(
                user.getId(),
                availabilityId
        );

        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
}