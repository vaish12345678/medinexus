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
public class BloodInventoryRequestDto {

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotNull(message = "Units available is required")
    @Min(value = 0, message = "Units available cannot be negative")
    private Integer unitsAvailable;
}