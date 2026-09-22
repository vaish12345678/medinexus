package com.medinexus.medicine.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineResponseDto {

    private Long id;

    private String name;

    private String genericName;

    private String manufacturer;

    private String description;
}