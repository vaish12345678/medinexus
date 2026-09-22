package com.medinexus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SymptomCheckRequestDto {

    @NotBlank(message = "Symptoms are required")
    private String symptoms;
}