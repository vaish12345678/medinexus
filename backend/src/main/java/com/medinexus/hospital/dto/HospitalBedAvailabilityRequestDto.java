package com.medinexus.hospital.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalBedAvailabilityRequestDto {

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotBlank(message = "Bed type is required")
    private String bedType;

    @NotNull(message = "Total beds is required")
    @Min(value = 0, message = "Total beds cannot be negative")
    private Integer totalBeds;

    @NotNull(message = "Available beds is required")
    @Min(value = 0, message = "Available beds cannot be negative")
    private Integer availableBeds;
}