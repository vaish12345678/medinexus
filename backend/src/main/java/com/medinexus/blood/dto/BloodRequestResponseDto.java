package com.medinexus.blood.dto;

import com.medinexus.blood.entity.BloodGroup;
import com.medinexus.blood.entity.BloodRequestStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequestResponseDto {

    private Long id;

    private Long patientId;

    private Long bloodBankId;

    private BloodGroup bloodGroup;

    private Integer unitsRequired;

    private String reason;

    private BloodRequestStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}