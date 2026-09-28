package com.medinexus.user.service;

import com.medinexus.user.dto.HospitalProfileRequestDto;
import com.medinexus.user.dto.HospitalProfileResponseDto;
import com.medinexus.user.entity.HospitalProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.HospitalProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalProfileService {

    private final HospitalProfileRepository hospitalRepository;



    @Transactional
    public HospitalProfileResponseDto createHospital(
            HospitalProfileRequestDto dto
    ) {

        HospitalProfile hospital =
                HospitalProfile.builder()
                        .hospitalName(dto.getHospitalName())
                        .address(dto.getAddress())
                        .city(dto.getCity())
                        .contactNumber(dto.getContactNumber())
                        .email(dto.getEmail())
                        .latitude(dto.getLatitude())
                        .longitude(dto.getLongitude())
                        .emergencyAvailable(
                                Boolean.TRUE.equals(
                                        dto.getEmergencyAvailable()
                                )
                        )
                        .description(dto.getDescription())
                        .verificationStatus(
                                VerificationStatus.VERIFIED
                        )
                        .active(true)
                        .build();

        HospitalProfile saved =
                hospitalRepository.save(hospital);

        return mapToResponse(saved);
    }

    // =========================================================
    // UPDATE HOSPITAL
    // =========================================================

    @Transactional
    public HospitalProfileResponseDto updateHospital(
            Long hospitalId,
            HospitalProfileRequestDto dto
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setHospitalName(dto.getHospitalName());
        hospital.setAddress(dto.getAddress());
        hospital.setCity(dto.getCity());
        hospital.setContactNumber(dto.getContactNumber());
        hospital.setEmail(dto.getEmail());
        hospital.setLatitude(dto.getLatitude());
        hospital.setLongitude(dto.getLongitude());

        hospital.setEmergencyAvailable(
                Boolean.TRUE.equals(
                        dto.getEmergencyAvailable()
                )
        );

        hospital.setDescription(dto.getDescription());

        return mapToResponse(
                hospitalRepository.save(hospital)
        );
    }

    // =========================================================
    // GET HOSPITAL BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public HospitalProfileResponseDto getHospitalById(
            Long hospitalId
    ) {

        return mapToResponse(
                getHospital(hospitalId)
        );
    }

    // =========================================================
    // GET ACTIVE HOSPITALS
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto> getActiveHospitals() {

        return hospitalRepository
                .findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET ALL HOSPITALS
    // Admin can see active + inactive hospitals
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto> getAllHospitals() {

        return hospitalRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET HOSPITALS BY CITY
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto> getHospitalsByCity(
            String city
    ) {

        return hospitalRepository
                .findByCityIgnoreCaseAndActiveTrue(city)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // GET EMERGENCY HOSPITALS
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto>
    getEmergencyHospitals() {

        return hospitalRepository
                .findByEmergencyAvailableTrueAndActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================================================
    // DEACTIVATE HOSPITAL
    // =========================================================

    @Transactional
    public HospitalProfileResponseDto deactivateHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setActive(false);

        return mapToResponse(
                hospitalRepository.save(hospital)
        );
    }

    // =========================================================
    // ACTIVATE HOSPITAL
    // =========================================================

    @Transactional
    public HospitalProfileResponseDto activateHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setActive(true);

        // Since Admin created the hospital,
        // keep it verified.
        hospital.setVerificationStatus(
                VerificationStatus.VERIFIED
        );

        return mapToResponse(
                hospitalRepository.save(hospital)
        );
    }

    // =========================================================
    // GET HOSPITAL
    // =========================================================

    private HospitalProfile getHospital(
            Long hospitalId
    ) {

        return hospitalRepository
                .findById(hospitalId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hospital not found"
                        )
                );
    }

    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private HospitalProfileResponseDto mapToResponse(
            HospitalProfile hospital
    ) {

        return HospitalProfileResponseDto.builder()
                .id(hospital.getId())
                .hospitalName(hospital.getHospitalName())
                .address(hospital.getAddress())
                .city(hospital.getCity())
                .contactNumber(hospital.getContactNumber())
                .email(hospital.getEmail())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .emergencyAvailable(
                        hospital.getEmergencyAvailable()
                )
                .description(hospital.getDescription())
                .verificationStatus(
                        hospital.getVerificationStatus()
                )
                .active(hospital.getActive())
                .build();
    }
}