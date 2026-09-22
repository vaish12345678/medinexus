package com.medinexus.prescription.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponseDto {

    private Long id;

    private Long consultationId;

    private String notes;

    private LocalDateTime createdAt;
}