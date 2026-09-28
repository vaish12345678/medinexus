package com.medinexus.consultation.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultationResponseDto {

    private Long id;

    private Long appointmentId;

    private String patientName;

    private Long prescriptionId;

    private String notes;

    private String diagnosisNotes;

    private LocalDateTime createdAt;
}