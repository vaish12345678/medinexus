package com.medinexus.medicine.controller;

import com.medinexus.medicine.dto.MedicineOrderRequestDto;
import com.medinexus.medicine.dto.MedicineOrderResponseDto;
import com.medinexus.medicine.dto.OrderItemResponseDto;
import com.medinexus.medicine.service.MedicineOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicine-orders")
public class MedicineOrderController {

    private final MedicineOrderService medicineOrderService;

    public MedicineOrderController(
            MedicineOrderService medicineOrderService
    ) {
        this.medicineOrderService = medicineOrderService;
    }


    // ============================================================
    // PATIENT CREATES ORDER
    // ============================================================

    @PostMapping
    public ResponseEntity<MedicineOrderResponseDto> createOrder(
            Authentication authentication,
            @Valid @RequestBody MedicineOrderRequestDto dto
    ) {

        Long patientUserId =
                Long.parseLong(authentication.getName());

        MedicineOrderResponseDto response =
                medicineOrderService.createOrder(
                        patientUserId,
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ============================================================
    // PATIENT GETS OWN ORDERS
    // ============================================================

    @GetMapping("/my")
    public ResponseEntity<List<MedicineOrderResponseDto>>
    getMyOrders(
            Authentication authentication
    ) {

        Long patientUserId =
                Long.parseLong(authentication.getName());

        List<MedicineOrderResponseDto> orders =
                medicineOrderService.getPatientOrders(
                        patientUserId
                );

        return ResponseEntity.ok(orders);
    }


    // ============================================================
    // PHARMACY GETS ITS ORDERS
    // ============================================================

    @GetMapping("/pharmacy")
    public ResponseEntity<List<MedicineOrderResponseDto>>
    getPharmacyOrders(
            Authentication authentication
    ) {

        Long pharmacyUserId =
                Long.parseLong(authentication.getName());

        List<MedicineOrderResponseDto> orders =
                medicineOrderService.getPharmacyOrders(
                        pharmacyUserId
                );

        return ResponseEntity.ok(orders);
    }


    // ============================================================
    // GET ORDER BY ID
    // ============================================================

    @GetMapping("/{orderId}")
    public ResponseEntity<MedicineOrderResponseDto>
    getOrderById(
            @PathVariable Long orderId
    ) {

        MedicineOrderResponseDto response =
                medicineOrderService.getOrderById(
                        orderId
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // GET ORDER ITEMS
    // ============================================================

    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItemResponseDto>>
    getOrderItems(
            @PathVariable Long orderId
    ) {

        List<OrderItemResponseDto> items =
                medicineOrderService.getOrderItems(
                        orderId
                );

        return ResponseEntity.ok(items);
    }


    // ============================================================
    // PHARMACY ACCEPTS ORDER
    // ============================================================

    @PutMapping("/{orderId}/accept")
    public ResponseEntity<MedicineOrderResponseDto>
    acceptOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        Long pharmacyUserId =
                Long.parseLong(authentication.getName());

        MedicineOrderResponseDto response =
                medicineOrderService.acceptOrder(
                        orderId,
                        pharmacyUserId
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // PHARMACY STARTS PROCESSING
    // ============================================================

    @PutMapping("/{orderId}/process")
    public ResponseEntity<MedicineOrderResponseDto>
    processOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        Long pharmacyUserId =
                Long.parseLong(authentication.getName());

        MedicineOrderResponseDto response =
                medicineOrderService.processOrder(
                        orderId,
                        pharmacyUserId
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // PHARMACY MARKS ORDER READY
    // ============================================================

    @PutMapping("/{orderId}/ready")
    public ResponseEntity<MedicineOrderResponseDto>
    markOrderReady(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        Long pharmacyUserId =
                Long.parseLong(authentication.getName());

        MedicineOrderResponseDto response =
                medicineOrderService.markOrderReady(
                        orderId,
                        pharmacyUserId
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // PHARMACY COMPLETES ORDER
    // ============================================================

    @PutMapping("/{orderId}/complete")
    public ResponseEntity<MedicineOrderResponseDto>
    completeOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        Long pharmacyUserId =
                Long.parseLong(authentication.getName());

        MedicineOrderResponseDto response =
                medicineOrderService.completeOrder(
                        orderId,
                        pharmacyUserId
                );

        return ResponseEntity.ok(response);
    }


    // ============================================================
    // PATIENT CANCELS ORDER
    // ============================================================

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<MedicineOrderResponseDto>
    cancelOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        Long patientUserId =
                Long.parseLong(authentication.getName());

        MedicineOrderResponseDto response =
                medicineOrderService.cancelOrder(
                        orderId,
                        patientUserId
                );

        return ResponseEntity.ok(response);
    }
}