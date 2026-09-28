package com.medinexus.hospital.dto.google;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoogleTextSearchRequestDto {

    private String textQuery;

    private LocationBias locationBias;

    private Integer maxResultCount;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationBias {

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