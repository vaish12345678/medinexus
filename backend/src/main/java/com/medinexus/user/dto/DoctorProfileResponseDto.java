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

    private String name;
    private String email;
    private String phone;

    private String specialization;
    private Integer experienceYears;
    private Double consultationFee;

    private String qualification;
    private String bio;

    private VerificationStatus verificationStatus;
}