package com.medinexus.NearbyBlood.service;

import com.medinexus.NearbyBlood.dto.NearbyBloodBankResponseDto;
import com.medinexus.hospital.dto.google.GooglePlaceDto;
import com.medinexus.hospital.dto.google.GooglePlacesResponseDto;
import com.medinexus.hospital.dto.google.GoogleTextSearchRequestDto;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class NearbyBloodBankService {

    private final RestClient googlePlacesTextSearchRestClient;

    public NearbyBloodBankService(
            @Qualifier("googlePlacesTextSearchRestClient")
            RestClient googlePlacesTextSearchRestClient
    ) {
        this.googlePlacesTextSearchRestClient =
                googlePlacesTextSearchRestClient;
    }

    public List<NearbyBloodBankResponseDto> findNearbyBloodBanks(
            Double latitude,
            Double longitude,
            Double radiusInKm
    ) {

        // 1. Validate location
        validateCoordinates(latitude, longitude);

        // 2. Validate radius
        if (radiusInKm == null || radiusInKm <= 0 || radiusInKm > 50) {
            throw new RuntimeException(
                    "Radius must be between 1 and 50 km"
            );
        }

        // Google expects radius in meters
        double radiusInMeters = radiusInKm * 1000;

        // 3. Build location center
        GoogleTextSearchRequestDto.Center center =
                new GoogleTextSearchRequestDto.Center(
                        latitude,
                        longitude
                );

        // 4. Build search circle
        GoogleTextSearchRequestDto.Circle circle =
                new GoogleTextSearchRequestDto.Circle(
                        center,
                        radiusInMeters
                );

        // 5. Build location bias
        GoogleTextSearchRequestDto.LocationBias locationBias =
                new GoogleTextSearchRequestDto.LocationBias(
                        circle
                );

        // 6. Build Text Search request
        GoogleTextSearchRequestDto request =
                new GoogleTextSearchRequestDto(
                        "blood bank",
                        locationBias,
                        20
                );

        // 7. Call Google Places Text Search
        GooglePlacesResponseDto response =
                googlePlacesTextSearchRestClient
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

        // 8. Handle empty response
        if (response == null || response.getPlaces() == null) {
            return List.of();
        }

        List<NearbyBloodBankResponseDto> bloodBanks =
                new ArrayList<>();

        // 9. Convert Google results
        for (GooglePlaceDto place : response.getPlaces()) {

            if (place.getLocation() == null) {
                continue;
            }

            double bloodBankLatitude =
                    place.getLocation().getLatitude();

            double bloodBankLongitude =
                    place.getLocation().getLongitude();

            double distanceInKm =
                    calculateDistance(
                            latitude,
                            longitude,
                            bloodBankLatitude,
                            bloodBankLongitude
                    );

            // Keep only results inside requested radius
            if (distanceInKm > radiusInKm) {
                continue;
            }

            String name = null;

            if (place.getDisplayName() != null) {
                name = place.getDisplayName().getText();
            }

            String mapsUrl =
                    "https://www.google.com/maps/search/?api=1&query="
                            + bloodBankLatitude
                            + ","
                            + bloodBankLongitude;

            bloodBanks.add(
                    NearbyBloodBankResponseDto.builder()
                            .name(name)
                            .address(place.getFormattedAddress())
                            .phoneNumber(place.getNationalPhoneNumber())
                            .latitude(bloodBankLatitude)
                            .longitude(bloodBankLongitude)
                            .distanceInKm(distanceInKm)
                            .placeId(place.getId())
                            .mapsUrl(mapsUrl)
                            .build()
            );
        }

        // 10. Nearest blood banks first
        bloodBanks.sort(
                (bloodBank1, bloodBank2) ->
                        Double.compare(
                                bloodBank1.getDistanceInKm(),
                                bloodBank2.getDistanceInKm()
                        )
        );

        return bloodBanks;
    }

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