package com.medinexus.medicine.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineOrderRequestDto {

    @NotNull(message = "Pharmacy ID is required")
    private Long pharmacyId;

    private Long prescriptionId;
}