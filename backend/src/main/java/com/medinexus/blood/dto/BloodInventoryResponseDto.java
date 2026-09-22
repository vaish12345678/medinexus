package com.medinexus.blood.dto;

import com.medinexus.blood.entity.BloodGroup;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodInventoryResponseDto {

    private Long id;

    private Long bloodBankId;

    private BloodGroup bloodGroup;

    private Integer unitsAvailable;
}