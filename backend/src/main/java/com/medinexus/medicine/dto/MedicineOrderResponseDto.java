package com.medinexus.medicine.dto;

import com.medinexus.medicine.entity.MedicineOrderStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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

    private String patientName;
    private String patientPhone;
    private String patientAddress;

    private String prescriptionNotes;

    private MedicineOrderStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<OrderMedicineDto> medicines;
}