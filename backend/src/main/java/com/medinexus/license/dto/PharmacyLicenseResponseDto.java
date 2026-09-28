package com.medinexus.license.dto;

import com.medinexus.user.entity.VerificationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyLicenseResponseDto {

    private Long id;

    private Long pharmacyId;

    private String licenseNumber;

    private String documentUrl;

    private VerificationStatus verificationStatus;

    private LocalDateTime submittedAt;

    private LocalDateTime verifiedAt;

    private String rejectionReason;
}