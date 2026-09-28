package com.medinexus.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileRequestDto {

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotNull(message = "Experience is required")
    private Integer experienceYears;

    @NotNull(message = "Consultation fee is required")
    private Double consultationFee;

    private String qualification;

    private String bio;
}