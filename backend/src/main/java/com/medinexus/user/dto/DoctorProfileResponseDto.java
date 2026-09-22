package com.medinexus.user.dto;

import com.medinexus.user.entity.VerificationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfileResponseDto {

    private Long id;

    private Long userId;

    private String specialization;

    private Integer experienceYears;

    private Double consultationFee;

    private VerificationStatus verificationStatus;
}