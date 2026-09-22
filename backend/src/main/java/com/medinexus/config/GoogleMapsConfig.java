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
}