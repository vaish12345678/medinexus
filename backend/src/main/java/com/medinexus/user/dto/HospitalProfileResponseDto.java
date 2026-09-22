package com.medinexus.user.dto;

import com.medinexus.user.entity.VerificationStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalProfileResponseDto {

    private Long id;

    private String hospitalName;

    private String address;

    private String city;

    private String contactNumber;

    private String email;

    private Double latitude;

    private Double longitude;

    private Boolean emergencyAvailable;

    private String description;

    private VerificationStatus verificationStatus;

    private Boolean active;
}