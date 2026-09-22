package com.medinexus.medicine.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineRequestDto {

    @NotBlank(message = "Medicine name is required")
    private String name;

    private String genericName;

    private String manufacturer;

    private String description;
}