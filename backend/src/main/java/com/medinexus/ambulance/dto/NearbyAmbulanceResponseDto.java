package com.medinexus.ambulance.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbyAmbulanceResponseDto {

    private String name;

    private String address;

    private String phoneNumber;

    private Double latitude;

    private Double longitude;

    private Double distanceInKm;

    private String placeId;

    private String mapsUrl;
}