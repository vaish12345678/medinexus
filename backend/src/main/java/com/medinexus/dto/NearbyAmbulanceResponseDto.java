package com.medinexus.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyAmbulanceResponseDto {

    private Long id;

    private String serviceName;

    private String contactNumber;

    private String address;

    private String ambulanceType;

    private Double latitude;

    private Double longitude;

    private Boolean isAvailable;

    private Double distanceInKm;

    private String mapsUrl;
}