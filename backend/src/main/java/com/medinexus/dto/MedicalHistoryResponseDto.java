package com.medinexus.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalHistoryResponseDto {

    private Long id;

    private Long patientId;

    private String condition;

    private String description;

    private LocalDate diagnosedDate;

    private String treatment;

    private String allergies;

    private LocalDateTime createdAt;
}