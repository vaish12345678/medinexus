package com.medinexus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class GoogleMapsConfig {

    @Value("${google.maps.api-key}")
    private String apiKey;

    @Value("${google.maps.places-url}")
    private String placesUrl;

    @Value("${google.maps.places-text-url}")
    private String placesTextUrl;

    // Existing client - used by Nearby Hospitals
    @Bean
    public RestClient googlePlacesRestClient() {

        return RestClient.builder()
                .baseUrl(placesUrl)
                .defaultHeader(
                        "X-Goog-Api-Key",
                        apiKey
                )
                .defaultHeader(
                        "Content-Type",
                        "application/json"
                )
                .build();
    }

    // New client - used by Blood Banks
    @Bean
    public RestClient googlePlacesTextSearchRestClient() {

        return RestClient.builder()
                .baseUrl(placesTextUrl)
                .defaultHeader(
                        "X-Goog-Api-Key",
                        apiKey
                )
                .defaultHeader(
                        "Content-Type",
                        "application/json"
                )
                .build();
    }
}