package com.medinexus.blood.dto;

import com.medinexus.blood.entity.BloodGroup;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodRequestRequestDto {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Units required is required")
    @Min(value = 1, message = "At least 1 unit is required")
    private Integer unitsRequired;

    private Long bloodBankId;

    private String reason;
}