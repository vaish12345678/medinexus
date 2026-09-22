package com.medinexus.blood.dto;

import com.medinexus.blood.entity.BloodGroup;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodBankRequestDto {

    @NotBlank(message = "Blood bank name is required")
    private String name;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    private Double latitude;

    private Double longitude;
}