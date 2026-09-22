package com.medinexus.hospital.dto.google;

import lombok.Data;

import java.util.List;

@Data
public class GooglePlacesResponseDto {

    private List<GooglePlaceDto> places;
}