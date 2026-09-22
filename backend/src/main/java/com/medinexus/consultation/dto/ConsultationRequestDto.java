package com.medinexus.consultation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationRequestDto {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    private String notes;

    private String diagnosisNotes;
}