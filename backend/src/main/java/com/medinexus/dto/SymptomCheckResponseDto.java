package com.medinexus.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymptomCheckResponseDto {

    private Long id;

    private Long patientId;

    private String symptoms;

    private String recommendedSpecialization;

    private String aiResponse;

    private LocalDateTime createdAt;
}