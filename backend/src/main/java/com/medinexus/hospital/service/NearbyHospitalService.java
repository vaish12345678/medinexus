package com.medinexus.hospital.service;

import com.medinexus.hospital.dto.NearbyHospitalResponseDto;
import com.medinexus.hospital.dto.google.GooglePlaceDto;
import com.medinexus.hospital.dto.google.GooglePlacesRequestDto;
import com.medinexus.hospital.dto.google.GooglePlacesResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NearbyHospitalService {

    private final RestClient googlePlacesRestClient;

    public List<NearbyHospitalResponseDto> findNearbyHospitals(
            Double latitude,
            Double longitude,
            Double radiusInKm
    ) {

        // 1. Validate patient's location
        validateCoordinates(latitude, longitude);

        // 2. Validate radius
        if (radiusInKm == null || radiusInKm <= 0) {
            throw new RuntimeException(
                    "Radius must be greater than 0"
            );
        }

        // Google expects radius in meters
        double radiusInMeters = radiusInKm * 1000;

        // 3. Build Google Places request
        GooglePlacesRequestDto.Center center =
                new GooglePlacesRequestDto.Center(
                        latitude,
                        longitude
                );

        GooglePlacesRequestDto.Circle circle =
                new GooglePlacesRequestDto.Circle(
                        center,
                        radiusInMeters
                );

        GooglePlacesRequestDto.LocationRestriction locationRestriction =
                new GooglePlacesRequestDto.LocationRestriction(
                        circle
                );

        GooglePlacesRequestDto request =
                new GooglePlacesRequestDto(
                        locationRestriction,
                        new String[]{"hospital"},
                        20
                );

        // 4. Call Google Places API
        GooglePlacesResponseDto response =
                googlePlacesRestClient
                        .post()
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(
                                "X-Goog-FieldMask",
                                "places.id," +
                                        "places.displayName," +
                                        "places.location," +
                                        "places.formattedAddress," +
                                        "places.nationalPhoneNumber"
                        )
                        .body(request)
                        .retrieve()
                        .body(GooglePlacesResponseDto.class);

        // 5. Handle empty response
        if (response == null || response.getPlaces() == null) {
            return List.of();
        }

        // 6. Convert Google response to our DTO
        List<NearbyHospitalResponseDto> hospitals =
                new ArrayList<>();

        for (GooglePlaceDto place : response.getPlaces()) {

            if (place.getLocation() == null) {
                continue;
            }

            double hospitalLatitude =
                    place.getLocation().getLatitude();

            double hospitalLongitude =
                    place.getLocation().getLongitude();

            // 7. Calculate distance
            double distanceInKm =
                    calculateDistance(
                            latitude,
                            longitude,
                            hospitalLatitude,
                            hospitalLongitude
                    );

            // 8. Create Google Maps URL
            String mapsUrl =
                    "https://www.google.com/maps/search/?api=1&query="
                            + hospitalLatitude
                            + ","
                            + hospitalLongitude;

            String name = null;

            if (place.getDisplayName() != null) {
                name = place.getDisplayName().getText();
            }

            String phoneNumber =
                    place.getNationalPhoneNumber();

            String address =
                    place.getFormattedAddress();

            hospitals.add(
                    new NearbyHospitalResponseDto(
                            name,
                            address,
                            phoneNumber,
                            hospitalLatitude,
                            hospitalLongitude,
                            distanceInKm,
                            place.getId(),
                            mapsUrl
                    )
            );
        }

        // 9. Sort nearest hospitals first
        hospitals.sort(
                (hospital1, hospital2) ->
                        Double.compare(
                                hospital1.getDistanceInKm(),
                                hospital2.getDistanceInKm()
                        )
        );

        return hospitals;
    }


    /**
     * Calculates distance between two coordinates
     * using the Haversine formula.
     */
    private double calculateDistance(
            double latitude1,
            double longitude1,
            double latitude2,
            double longitude2
    ) {

        final double EARTH_RADIUS_KM = 6371.0;

        double latitudeDifference =
                Math.toRadians(latitude2 - latitude1);

        double longitudeDifference =
                Math.toRadians(longitude2 - longitude1);

        double a =
                Math.sin(latitudeDifference / 2)
                        * Math.sin(latitudeDifference / 2)
                        +
                        Math.cos(Math.toRadians(latitude1))
                                * Math.cos(Math.toRadians(latitude2))
                                * Math.sin(longitudeDifference / 2)
                                * Math.sin(longitudeDifference / 2);

        double c =
                2 * Math.atan2(
                        Math.sqrt(a),
                        Math.sqrt(1 - a)
                );

        return Math.round(
                EARTH_RADIUS_KM * c * 100.0
        ) / 100.0;
    }


    /**
     * Validates patient's latitude and longitude.
     */
    private void validateCoordinates(
            Double latitude,
            Double longitude
    ) {

        if (latitude == null
                || latitude < -90
                || latitude > 90) {

            throw new RuntimeException(
                    "Invalid latitude"
            );
        }

        if (longitude == null
                || longitude < -180
                || longitude > 180) {

            throw new RuntimeException(
                    "Invalid longitude"
            );
        }
    }
}