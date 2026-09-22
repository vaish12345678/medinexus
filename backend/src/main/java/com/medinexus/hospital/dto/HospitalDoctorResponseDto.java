package com.medinexus.hospital.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDoctorResponseDto {

    private Long id;

    private Long hospitalId;

    private String hospitalName;

    private Long doctorId;

    private String doctorName;

    private Long departmentId;

    private String departmentName;

    private Boolean active;
}