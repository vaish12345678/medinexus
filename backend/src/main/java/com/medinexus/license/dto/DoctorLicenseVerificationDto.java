package com.medinexus.license.dto;

import com.medinexus.user.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorLicenseVerificationDto {

    @NotNull(message = "Verification status is required")
    private VerificationStatus verificationStatus;

    private String rejectionReason;
}