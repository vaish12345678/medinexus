package com.medinexus.hospital.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalBedAvailabilityResponseDto {

    private Long id;

    private Long hospitalId;

    private String hospitalName;

    private String bedType;

    private Integer totalBeds;

    private Integer availableBeds;

    private LocalDateTime lastUpdated;
}