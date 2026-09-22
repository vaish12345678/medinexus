package com.medinexus.organ.dto;

import com.medinexus.organ.entity.OrganType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganDonorRequestDto {

    @NotNull(message = "Organ type is required")
    private OrganType organType;
}