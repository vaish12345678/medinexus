package com.medinexus.medicine.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderMedicineDto {

    private Long medicineId;

    private String medicineName;

    private Integer quantity;

    private Double price;

    private String dosage;

    private String frequency;

    private String duration;

    private String instructions;
}