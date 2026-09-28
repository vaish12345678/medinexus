package com.medinexus.medicine.controller;

import com.medinexus.medicine.dto.MedicineOrderRequestDto;
import com.medinexus.medicine.dto.MedicineOrderResponseDto;
import com.medinexus.medicine.dto.OrderItemResponseDto;
import com.medinexus.medicine.service.MedicineOrderService;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicine-orders")
public class MedicineOrderController {

    private final MedicineOrderService medicineOrderService;
    private final UserRepository userRepository;

    public MedicineOrderController(
            MedicineOrderService medicineOrderService,
            UserRepository userRepository
    ) {
        this.medicineOrderService = medicineOrderService;
        this.userRepository = userRepository;
    }

    // ============================================================
    // PATIENT CREATES ORDER
    // ============================================================

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<MedicineOrderResponseDto> createOrder(
            Authentication authentication,
            @Valid @RequestBody MedicineOrderRequestDto dto
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        MedicineOrderResponseDto response =
                medicineOrderService.createOrder(
                        userId,
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
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<MedicineOrderResponseDto>> getMyOrders(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        List<MedicineOrderResponseDto> orders =
                medicineOrderService.getPatientOrders(userId);

        return ResponseEntity.ok(orders);
    }

    // ============================================================
    // PHARMACY GETS ITS ORDERS
    // ============================================================

    @GetMapping("/pharmacy")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<List<MedicineOrderResponseDto>> getPharmacyOrders(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        List<MedicineOrderResponseDto> orders =
                medicineOrderService.getPharmacyOrders(userId);

        return ResponseEntity.ok(orders);
    }

    // ============================================================
    // GET ORDER BY ID
    // ============================================================

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('PATIENT','PHARMACY','ADMIN')")
    public ResponseEntity<MedicineOrderResponseDto> getOrderById(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        MedicineOrderResponseDto response =
                medicineOrderService.getOrderById(
                        orderId,
                        userId,
                        user.getRole()
                );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET ORDER ITEMS
    // ============================================================

    @GetMapping("/{orderId}/items")
    @PreAuthorize("hasAnyRole('PATIENT','PHARMACY','ADMIN')")
    public ResponseEntity<List<OrderItemResponseDto>> getOrderItems(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        List<OrderItemResponseDto> items =
                medicineOrderService.getOrderItems(
                        orderId,
                        userId,
                        user.getRole()
                );

        return ResponseEntity.ok(items);
    }

    // ============================================================
    // PHARMACY ACCEPTS ORDER
    // ============================================================

    @PutMapping("/{orderId}/accept")
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<MedicineOrderResponseDto> acceptOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long pharmacyUserId = user.getId();

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
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<MedicineOrderResponseDto> processOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long pharmacyUserId = user.getId();

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
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<MedicineOrderResponseDto> markOrderReady(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long pharmacyUserId = user.getId();

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
    @PreAuthorize("hasRole('PHARMACY')")
    public ResponseEntity<MedicineOrderResponseDto> completeOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long pharmacyUserId = user.getId();

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
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<MedicineOrderResponseDto> cancelOrder(
            Authentication authentication,
            @PathVariable Long orderId
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long userId = user.getId();

        MedicineOrderResponseDto response =
                medicineOrderService.cancelOrder(
                        orderId,
                        userId
                );

        return ResponseEntity.ok(response);
    }
}