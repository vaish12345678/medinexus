package com.medinexus.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalProfileRequestDto {

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "Address is required")
    private String address;

    private String city;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    private String email;

    private Double latitude;

    private Double longitude;

    private Boolean emergencyAvailable;

    private String description;
}