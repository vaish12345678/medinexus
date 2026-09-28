package com.medinexus.medicine.controller;

import com.medinexus.medicine.dto.MedicineRequestDto;
import com.medinexus.medicine.dto.MedicineResponseDto;
import com.medinexus.medicine.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;
    private final UserRepository userRepository;

    public MedicineController(
            MedicineService medicineService, UserRepository userRepository
    ) {
        this.medicineService = medicineService;
        this.userRepository = userRepository;
    }


    // Create medicine
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MedicineResponseDto> createMedicine(
            Authentication authentication,
            @Valid @RequestBody MedicineRequestDto dto
    ) {

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        MedicineResponseDto response =
                medicineService.createMedicine(dto, user.getRole());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // Get all medicines
    @GetMapping
    public ResponseEntity<List<MedicineResponseDto>>
    getAllMedicines() {

        return ResponseEntity.ok(
                medicineService.getAllMedicines()
        );
    }


    // Get medicine by ID
    @GetMapping("/{medicineId}")
    public ResponseEntity<MedicineResponseDto>
    getMedicineById(
            @PathVariable Long medicineId
    ) {

        return ResponseEntity.ok(
                medicineService.getMedicineById(medicineId)
        );
    }


    // Update medicine
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{medicineId}")
    public ResponseEntity<MedicineResponseDto>
    updateMedicine(
            Authentication authentication,
            @PathVariable Long medicineId,
            @Valid @RequestBody MedicineRequestDto dto
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                medicineService.updateMedicine(
                        medicineId,
                        dto,
                        user.getRole()
                )
        );
    }


    // Delete medicine
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{medicineId}")
    public ResponseEntity<Void> deleteMedicine(
            Authentication authentication,
            @PathVariable Long medicineId
    ) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        medicineService.deleteMedicine(
                medicineId,
                user.getRole()
        );

        return ResponseEntity.noContent().build();
    }
}