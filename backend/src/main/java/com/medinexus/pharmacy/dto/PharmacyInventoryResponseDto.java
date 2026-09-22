package com.medinexus.pharmacy.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyInventoryResponseDto {

    private Long id;

    private Long pharmacyId;

    private Long medicineId;

    private BigDecimal price;

    private Integer stockQuantity;

    private Boolean available;
}