package com.medinexus.hospital.service;

import com.medinexus.hospital.dto.HospitalBedAvailabilityRequestDto;
import com.medinexus.hospital.dto.HospitalBedAvailabilityResponseDto;
import com.medinexus.hospital.entity.HospitalBedAvailability;
import com.medinexus.user.entity.HospitalProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.hospital.repository.HospitalBedAvailabilityRepository;
import com.medinexus.user.repository.HospitalProfileRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalBedAvailabilityService {

    private final HospitalBedAvailabilityRepository
            bedAvailabilityRepository;

    private final HospitalProfileRepository
            hospitalProfileRepository;


    // =========================
    // ADD BED AVAILABILITY
    // =========================

    @Transactional
    public HospitalBedAvailabilityResponseDto addBedAvailability(
            Long hospitalId,
            HospitalBedAvailabilityRequestDto request
    ) {

        HospitalProfile hospital = getVerifiedActiveHospital(hospitalId);

        String bedType = normalizeBedType(request.getBedType());

        // Validate available beds <= total beds
        validateBedNumbers(
                request.getTotalBeds(),
                request.getAvailableBeds()
        );

        // Prevent duplicate bed type for same hospital
        if (bedAvailabilityRepository
                .findByHospitalAndBedType(hospital, bedType)
                .isPresent()) {

            throw new RuntimeException(
                    "Bed availability for "
                            + bedType
                            + " already exists for this hospital"
            );
        }

        HospitalBedAvailability bedAvailability =
                HospitalBedAvailability.builder()
                        .hospital(hospital)
                        .bedType(bedType)
                        .totalBeds(request.getTotalBeds())
                        .availableBeds(request.getAvailableBeds())
                        .build();

        HospitalBedAvailability saved =
                bedAvailabilityRepository.save(bedAvailability);

        return mapToResponse(saved);
    }


    // =========================
    // UPDATE BED AVAILABILITY
    // =========================

    @Transactional
    public HospitalBedAvailabilityResponseDto updateBedAvailability(
            Long hospitalId,
            Long availabilityId,
            HospitalBedAvailabilityRequestDto request
    ) {

        HospitalProfile hospital =
                getVerifiedActiveHospital(hospitalId);

        HospitalBedAvailability bedAvailability =
                bedAvailabilityRepository
                        .findById(availabilityId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bed availability record not found"
                                )
                        );

        // Make sure this record belongs to the hospital
        if (!bedAvailability.getHospital()
                .getId()
                .equals(hospital.getId())) {

            throw new RuntimeException(
                    "Bed availability record does not belong to this hospital"
            );
        }

        String bedType =
                normalizeBedType(request.getBedType());

        validateBedNumbers(
                request.getTotalBeds(),
                request.getAvailableBeds()
        );

        // If changing bed type, make sure the new type
        // doesn't already exist
        if (!bedAvailability.getBedType().equals(bedType)) {

            bedAvailabilityRepository
                    .findByHospitalAndBedType(
                            hospital,
                            bedType
                    )
                    .ifPresent(existing -> {
                        throw new RuntimeException(
                                "Bed availability for "
                                        + bedType
                                        + " already exists"
                        );
                    });
        }

        bedAvailability.setBedType(bedType);
        bedAvailability.setTotalBeds(
                request.getTotalBeds()
        );
        bedAvailability.setAvailableBeds(
                request.getAvailableBeds()
        );

        HospitalBedAvailability updated =
                bedAvailabilityRepository.save(
                        bedAvailability
                );

        return mapToResponse(updated);
    }


    // =========================
    // GET ALL BEDS OF HOSPITAL
    // =========================

    @Transactional(readOnly = true)
    public List<HospitalBedAvailabilityResponseDto>
    getHospitalBedAvailability(Long hospitalId) {

        HospitalProfile hospital =
                getVerifiedActiveHospital(hospitalId);

        return bedAvailabilityRepository
                .findByHospital(hospital)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================
    // GET BED RECORD BY ID
    // =========================

    @Transactional(readOnly = true)
    public HospitalBedAvailabilityResponseDto
    getBedAvailabilityById(Long availabilityId) {

        HospitalBedAvailability bedAvailability =
                bedAvailabilityRepository
                        .findById(availabilityId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bed availability record not found"
                                )
                        );

        return mapToResponse(bedAvailability);
    }


    // =========================
    // DELETE BED AVAILABILITY
    // =========================

    @Transactional
    public void deleteBedAvailability(
            Long hospitalId,
            Long availabilityId
    ) {

        HospitalProfile hospital =
                getVerifiedActiveHospital(hospitalId);

        HospitalBedAvailability bedAvailability =
                bedAvailabilityRepository
                        .findById(availabilityId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bed availability record not found"
                                )
                        );

        // Ownership check
        if (!bedAvailability.getHospital()
                .getId()
                .equals(hospital.getId())) {

            throw new RuntimeException(
                    "Bed availability record does not belong to this hospital"
            );
        }

        bedAvailabilityRepository.delete(
                bedAvailability
        );
    }


    // =========================
    // FIND AVAILABLE BEDS
    // =========================

    @Transactional(readOnly = true)
    public List<HospitalBedAvailabilityResponseDto>
    findAvailableBeds(
            Long hospitalId,
            Integer minimumAvailableBeds
    ) {

        HospitalProfile hospital =
                getVerifiedActiveHospital(hospitalId);

        if (minimumAvailableBeds == null
                || minimumAvailableBeds < 0) {

            throw new RuntimeException(
                    "Minimum available beds cannot be negative"
            );
        }

        return bedAvailabilityRepository
                .findByHospitalAndAvailableBedsGreaterThan(
                        hospital,
                        minimumAvailableBeds
                )
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================
    // GET VERIFIED ACTIVE HOSPITAL
    // =========================

    private HospitalProfile getVerifiedActiveHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                hospitalProfileRepository
                        .findById(hospitalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hospital not found"
                                )
                        );

        if (hospital.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Hospital must be verified"
            );
        }

        if (!hospital.getActive()) {

            throw new RuntimeException(
                    "Hospital is currently inactive"
            );
        }

        return hospital;
    }


    // =========================
    // VALIDATE BED NUMBERS
    // =========================

    private void validateBedNumbers(
            Integer totalBeds,
            Integer availableBeds
    ) {

        if (totalBeds == null || totalBeds < 0) {

            throw new RuntimeException(
                    "Total beds cannot be negative"
            );
        }

        if (availableBeds == null || availableBeds < 0) {

            throw new RuntimeException(
                    "Available beds cannot be negative"
            );
        }

        if (availableBeds > totalBeds) {

            throw new RuntimeException(
                    "Available beds cannot be greater than total beds"
            );
        }
    }


    // =========================
    // NORMALIZE BED TYPE
    // =========================

    private String normalizeBedType(String bedType) {

        if (bedType == null
                || bedType.trim().isEmpty()) {

            throw new RuntimeException(
                    "Bed type is required"
            );
        }

        return bedType
                .trim()
                .toUpperCase();
    }


    // =========================
    // ENTITY → RESPONSE DTO
    // =========================

    private HospitalBedAvailabilityResponseDto
    mapToResponse(
            HospitalBedAvailability bedAvailability
    ) {

        return HospitalBedAvailabilityResponseDto
                .builder()
                .id(bedAvailability.getId())
                .hospitalId(
                        bedAvailability
                                .getHospital()
                                .getId()
                )
                .hospitalName(
                        bedAvailability
                                .getHospital()
                                .getHospitalName()
                )
                .bedType(
                        bedAvailability.getBedType()
                )
                .totalBeds(
                        bedAvailability.getTotalBeds()
                )
                .availableBeds(
                        bedAvailability.getAvailableBeds()
                )
                .lastUpdated(
                        bedAvailability.getLastUpdated()
                )
                .build();
    }
}