package com.medinexus.hospital.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalSchemeResponse {

    private Long id;
    private String name;
    private String description;
    private String provider;
    private String category;
    private String officialUrl;
    private Boolean active;
}