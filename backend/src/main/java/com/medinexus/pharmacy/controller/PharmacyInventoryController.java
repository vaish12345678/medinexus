package com.medinexus.pharmacy.controller;

import com.medinexus.pharmacy.dto.PharmacyInventoryRequestDto;
import com.medinexus.pharmacy.dto.PharmacyInventoryResponseDto;
import com.medinexus.pharmacy.service.PharmacyInventoryService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pharmacy-inventory")
@RequiredArgsConstructor
public class PharmacyInventoryController {

    private final PharmacyInventoryService pharmacyInventoryService;
    private final UserRepository userRepository;


    // ============================================================
    // ADD MEDICINE TO MY INVENTORY
    // ============================================================

    @PostMapping
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyInventoryResponseDto> addInventory(
            @Valid @RequestBody PharmacyInventoryRequestDto request,
            Authentication authentication
    ) {

        Long pharmacyId = getLoggedInUserId(authentication);

        PharmacyInventoryResponseDto response =
                pharmacyInventoryService.addInventory(
                        pharmacyId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ============================================================
    // GET MY PHARMACY INVENTORY
    // ============================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<PharmacyInventoryResponseDto>>
    getMyInventory(
            Authentication authentication
    ) {

        Long pharmacyId = getLoggedInUserId(authentication);

        return ResponseEntity.ok(
                pharmacyInventoryService.getPharmacyInventory(
                        pharmacyId
                )
        );
    }


    // ============================================================
    // GET AVAILABLE INVENTORY OF A PHARMACY
    // ============================================================

    @GetMapping("/pharmacy/{pharmacyId}/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PharmacyInventoryResponseDto>>
    getAvailableInventory(
            @PathVariable Long pharmacyId
    ) {

        return ResponseEntity.ok(
                pharmacyInventoryService.getAvailableInventory(
                        pharmacyId
                )
        );
    }


    // ============================================================
    // GET COMPLETE INVENTORY OF A PHARMACY
    // ============================================================

    @GetMapping("/pharmacy/{pharmacyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PharmacyInventoryResponseDto>>
    getPharmacyInventory(
            @PathVariable Long pharmacyId
    ) {

        return ResponseEntity.ok(
                pharmacyInventoryService.getPharmacyInventory(
                        pharmacyId
                )
        );
    }


    // ============================================================
    // GET INVENTORY ITEM BY ID
    // ============================================================

    @GetMapping("/{inventoryId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PharmacyInventoryResponseDto>
    getInventoryById(
            @PathVariable Long inventoryId
    ) {

        return ResponseEntity.ok(
                pharmacyInventoryService.getInventoryById(
                        inventoryId
                )
        );
    }


    // ============================================================
    // UPDATE MY INVENTORY ITEM
    // ============================================================

    @PutMapping("/{inventoryId}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<PharmacyInventoryResponseDto>
    updateInventory(
            @PathVariable Long inventoryId,
            @Valid @RequestBody PharmacyInventoryRequestDto request,
            Authentication authentication
    ) {

        Long pharmacyId = getLoggedInUserId(authentication);

        PharmacyInventoryResponseDto response =
                pharmacyInventoryService.updateInventory(
                        pharmacyId,
                        inventoryId,
                        request
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // DELETE MY INVENTORY ITEM
    // ============================================================

    @DeleteMapping("/{inventoryId}")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<String> deleteInventory(
            @PathVariable Long inventoryId,
            Authentication authentication
    ) {

        Long pharmacyId = getLoggedInUserId(authentication);

        pharmacyInventoryService.deleteInventory(
                pharmacyId,
                inventoryId
        );

        return ResponseEntity.ok(
                "Medicine removed from pharmacy inventory"
        );
    }


    // ============================================================
    // FIND MEDICINE ACROSS PHARMACIES
    // ============================================================

    @GetMapping("/medicine/{medicineId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PharmacyInventoryResponseDto>>
    findMedicineInPharmacies(
            @PathVariable Long medicineId
    ) {

        return ResponseEntity.ok(
                pharmacyInventoryService
                        .findMedicineInPharmacies(medicineId)
        );
    }


    // ============================================================
    // GET LOGGED-IN USER ID
    // ============================================================

    private Long getLoggedInUserId(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return user.getId();
    }
}