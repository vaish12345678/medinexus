package com.medinexus.hospital.dto.google;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GooglePlacesRequestDto {

    private LocationRestriction locationRestriction;

    private String[] includedTypes;

    private Integer maxResultCount;


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationRestriction {

        private Circle circle;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Circle {

        private Center center;

        private Double radius;
    }


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Center {

        private Double latitude;

        private Double longitude;
    }
}