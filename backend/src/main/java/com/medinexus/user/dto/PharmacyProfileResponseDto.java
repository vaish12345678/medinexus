package com.medinexus.user.dto;

import com.medinexus.user.entity.VerificationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyProfileResponseDto {

    private Long id;

    private Long userId;

    private String pharmacyName;

    private String address;

    private VerificationStatus verificationStatus;
}