package com.medinexus.prescription.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionRequestDto {

    @NotNull(message = "Consultation ID is required")
    private Long consultationId;

    private String notes;
}