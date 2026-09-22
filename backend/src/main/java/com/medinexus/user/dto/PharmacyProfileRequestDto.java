package com.medinexus.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyProfileRequestDto {

    @NotBlank(message = "Pharmacy name is required")
    private String pharmacyName;

    @NotBlank(message = "Address is required")
    private String address;

    private String licenseUrl;
}