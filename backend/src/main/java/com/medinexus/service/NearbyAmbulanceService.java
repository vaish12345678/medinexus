package com.medinexus.service;

import com.medinexus.Entity.AmbulanceService;
import com.medinexus.dto.NearbyAmbulanceResponseDto;
import com.medinexus.repository.AmbulanceServiceRepository;
import com.medinexus.user.entity.VerificationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NearbyAmbulanceService {

    private final AmbulanceServiceRepository ambulanceServiceRepository;

    public List<NearbyAmbulanceResponseDto> findNearbyAmbulances(
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

        // 3. Get only available + verified ambulance services
        List<AmbulanceService> ambulanceServices =
                ambulanceServiceRepository
                        .findByIsAvailableTrueAndVerificationStatus(
                                VerificationStatus.VERIFIED
                        );

        List<NearbyAmbulanceResponseDto> ambulances =
                new ArrayList<>();

        // 4. Calculate distance for every ambulance
        for (AmbulanceService ambulance : ambulanceServices) {

            if (ambulance.getLatitude() == null
                    || ambulance.getLongitude() == null) {
                continue;
            }

            double distanceInKm =
                    calculateDistance(
                            latitude,
                            longitude,
                            ambulance.getLatitude(),
                            ambulance.getLongitude()
                    );

            // 5. Keep only ambulances inside requested radius
            if (distanceInKm > radiusInKm) {
                continue;
            }

            // 6. Create Google Maps URL
            String mapsUrl =
                    "https://www.google.com/maps/search/?api=1&query="
                            + ambulance.getLatitude()
                            + ","
                            + ambulance.getLongitude();

            ambulances.add(
                    NearbyAmbulanceResponseDto.builder()
                            .id(ambulance.getId())
                            .serviceName(ambulance.getServiceName())
                            .contactNumber(ambulance.getContactNumber())
                            .address(ambulance.getAddress())
                            .ambulanceType(ambulance.getAmbulanceType())
                            .latitude(ambulance.getLatitude())
                            .longitude(ambulance.getLongitude())
                            .isAvailable(ambulance.getIsAvailable())
                            .distanceInKm(distanceInKm)
                            .mapsUrl(mapsUrl)
                            .build()
            );
        }

        // 7. Sort nearest ambulances first
        ambulances.sort(
                (ambulance1, ambulance2) ->
                        Double.compare(
                                ambulance1.getDistanceInKm(),
                                ambulance2.getDistanceInKm()
                        )
        );

        return ambulances;
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