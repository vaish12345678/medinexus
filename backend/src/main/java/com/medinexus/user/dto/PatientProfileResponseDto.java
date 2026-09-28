package com.medinexus.user.dto;

import com.medinexus.user.entity.BloodGroup;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileResponseDto {

    private Long id;

    private Long userId;

    private LocalDate dateOfBirth;

    private String gender;

    private BloodGroup bloodGroup;

    private String address;
    private String name;
    private String email;
    private String phone;
}