package com.medinexus.hospital.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDepartmentResponseDto {

    private Long id;

    private Long hospitalId;

    private String hospitalName;

    private String name;

    private String description;

    private String floor;

    private String contactNumber;

    private Boolean active;
}