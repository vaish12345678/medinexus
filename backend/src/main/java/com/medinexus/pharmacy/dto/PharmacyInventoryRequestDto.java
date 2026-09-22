package com.medinexus.pharmacy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyInventoryRequestDto {

    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    private Integer stockQuantity;

    @NotNull(message = "Availability status is required")
    private Boolean available;
}