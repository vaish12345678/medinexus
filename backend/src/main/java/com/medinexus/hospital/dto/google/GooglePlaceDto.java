package com.medinexus.hospital.dto.google;

import lombok.Data;

@Data
public class GooglePlaceDto {

    private String id;

    private GoogleDisplayNameDto displayName;

    private GoogleLocationDto location;

    private String formattedAddress;

    private String nationalPhoneNumber;
}