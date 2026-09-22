package com.medinexus.medicine.controller;

import com.medinexus.medicine.dto.MedicineRequestDto;
import com.medinexus.medicine.dto.MedicineResponseDto;
import com.medinexus.medicine.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(
            MedicineService medicineService
    ) {
        this.medicineService = medicineService;
    }


    // Create medicine
    @PostMapping
    public ResponseEntity<MedicineResponseDto> createMedicine(
            @Valid @RequestBody MedicineRequestDto dto
    ) {

        MedicineResponseDto response =
                medicineService.createMedicine(dto);

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
    @PutMapping("/{medicineId}")
    public ResponseEntity<MedicineResponseDto>
    updateMedicine(
            @PathVariable Long medicineId,
            @Valid @RequestBody MedicineRequestDto dto
    ) {

        return ResponseEntity.ok(
                medicineService.updateMedicine(
                        medicineId,
                        dto
                )
        );
    }


    // Delete medicine
    @DeleteMapping("/{medicineId}")
    public ResponseEntity<Void> deleteMedicine(
            @PathVariable Long medicineId
    ) {

        medicineService.deleteMedicine(medicineId);

        return ResponseEntity.noContent().build();
    }
}