package com.medinexus.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeminiSymptomResponseDto {

    private String recommendedSpecialization;

    private String response;
}