package com.medinexus.blood.dto;

import com.medinexus.user.entity.VerificationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBankResponseDto {

    private Long id;

    private String name;

    private String address;

    private String contactNumber;

    private Double latitude;

    private Double longitude;

    private VerificationStatus verificationStatus;
}