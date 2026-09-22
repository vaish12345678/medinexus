package com.medinexus.hospital.controller;

import com.medinexus.hospital.dto.HospitalDepartmentRequestDto;
import com.medinexus.hospital.dto.HospitalDepartmentResponseDto;
import com.medinexus.hospital.service.HospitalDepartmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalDepartmentController {

    private final HospitalDepartmentService departmentService;


    // =========================================================
    // CREATE DEPARTMENT
    // =========================================================

    @PostMapping("/{hospitalId}/departments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDepartmentResponseDto>
    createDepartment(
            @PathVariable Long hospitalId,
            @Valid @RequestBody HospitalDepartmentRequestDto request
    ) {

        HospitalDepartmentResponseDto response =
                departmentService.createDepartment(
                        hospitalId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // UPDATE DEPARTMENT
    // =========================================================

    @PutMapping(
            "/{hospitalId}/departments/{departmentId}"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDepartmentResponseDto>
    updateDepartment(
            @PathVariable Long hospitalId,
            @PathVariable Long departmentId,
            @Valid @RequestBody HospitalDepartmentRequestDto request
    ) {

        HospitalDepartmentResponseDto response =
                departmentService.updateDepartment(
                        hospitalId,
                        departmentId,
                        request
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET ALL DEPARTMENTS
    // =========================================================

    @GetMapping("/{hospitalId}/departments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalDepartmentResponseDto>>
    getHospitalDepartments(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                departmentService.getHospitalDepartments(
                        hospitalId
                )
        );
    }


    // =========================================================
    // GET ACTIVE DEPARTMENTS
    // =========================================================

    @GetMapping("/{hospitalId}/departments/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HospitalDepartmentResponseDto>>
    getActiveHospitalDepartments(
            @PathVariable Long hospitalId
    ) {

        return ResponseEntity.ok(
                departmentService.getActiveHospitalDepartments(
                        hospitalId
                )
        );
    }


    // =========================================================
    // GET DEPARTMENT BY ID
    // =========================================================

    @GetMapping("/hospital-departments/{departmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<HospitalDepartmentResponseDto>
    getDepartmentById(
            @PathVariable Long departmentId
    ) {

        return ResponseEntity.ok(
                departmentService.getDepartmentById(
                        departmentId
                )
        );
    }


    // =========================================================
    // DELETE DEPARTMENT
    // =========================================================

    @DeleteMapping(
            "/{hospitalId}/departments/{departmentId}"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable Long hospitalId,
            @PathVariable Long departmentId
    ) {

        departmentService.deleteDepartment(
                hospitalId,
                departmentId
        );

        return ResponseEntity.ok(
                "Department deleted successfully"
        );
    }


    // =========================================================
    // ACTIVATE DEPARTMENT
    // =========================================================

    @PutMapping(
            "/{hospitalId}/departments/{departmentId}/activate"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDepartmentResponseDto>
    activateDepartment(
            @PathVariable Long hospitalId,
            @PathVariable Long departmentId
    ) {

        return ResponseEntity.ok(
                departmentService.activateDepartment(
                        hospitalId,
                        departmentId
                )
        );
    }


    // =========================================================
    // DEACTIVATE DEPARTMENT
    // =========================================================

    @PutMapping(
            "/{hospitalId}/departments/{departmentId}/deactivate"
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HospitalDepartmentResponseDto>
    deactivateDepartment(
            @PathVariable Long hospitalId,
            @PathVariable Long departmentId
    ) {

        return ResponseEntity.ok(
                departmentService.deactivateDepartment(
                        hospitalId,
                        departmentId
                )
        );
    }
}