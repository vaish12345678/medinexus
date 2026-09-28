package com.medinexus.user.dto;

import com.medinexus.user.entity.BloodGroup;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileRequestDto {

    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
    private String gender;

    private BloodGroup bloodGroup;

    private String address;
}