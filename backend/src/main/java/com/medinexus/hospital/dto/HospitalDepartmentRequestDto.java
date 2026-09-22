package com.medinexus.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDepartmentRequestDto {

    @NotBlank(message = "Department name is required")
    private String name;

    private String description;

    private String floor;

    private String contactNumber;

    private Boolean active;
}