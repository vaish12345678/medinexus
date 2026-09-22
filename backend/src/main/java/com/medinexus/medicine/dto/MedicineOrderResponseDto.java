package com.medinexus.medicine.dto;

import com.medinexus.medicine.entity.MedicineOrderStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineOrderResponseDto {

    private Long id;

    private Long patientId;

    private Long pharmacyId;

    private Long prescriptionId;

    private MedicineOrderStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}