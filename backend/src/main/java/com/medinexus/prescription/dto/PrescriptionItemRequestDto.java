package com.medinexus.prescription.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemRequestDto {

    @NotNull(message = "Prescription ID is required")
    private Long prescriptionId;

    @NotNull(message = "Medicine ID is required")
    private Long medicineId;

    @NotNull(message = "Dosage is required")
    private String dosage;

    @NotNull(message = "Frequency is required")
    private String frequency;

    @NotNull(message = "Duration is required")
    private String duration;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String instructions;
}