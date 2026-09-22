package com.medinexus.prescription.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionItemResponseDto {

    private Long id;

    private Long prescriptionId;

    private Long medicineId;

    private String dosage;

    private String frequency;

    private String duration;

    private Integer quantity;

    private String instructions;
}