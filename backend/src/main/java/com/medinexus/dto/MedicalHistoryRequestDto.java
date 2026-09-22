package com.medinexus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistoryRequestDto {

    @NotBlank(message = "Condition is required")
    private String condition;

    private String description;

    private LocalDate diagnosedDate;

    private String treatment;

    private String allergies;
}