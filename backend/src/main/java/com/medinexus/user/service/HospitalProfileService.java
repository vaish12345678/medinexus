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
                                VerificationStatus.PENDING
                        )
                        .active(true)
                        .build();

        HospitalProfile saved =
                hospitalRepository.save(hospital);

        return mapToResponse(saved);
    }

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

    @Transactional(readOnly = true)
    public HospitalProfileResponseDto getHospitalById(
            Long hospitalId
    ) {

        return mapToResponse(
                getHospital(hospitalId)
        );
    }

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto> getActiveHospitals() {

        return hospitalRepository
                .findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

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

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto>
    getEmergencyHospitals() {

        return hospitalRepository
                .findByEmergencyAvailableTrueAndActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HospitalProfileResponseDto>
    getPendingHospitals() {

        return hospitalRepository
                .findByVerificationStatus(
                        VerificationStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public HospitalProfileResponseDto verifyHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setVerificationStatus(
                VerificationStatus.VERIFIED
        );

        return mapToResponse(
                hospitalRepository.save(hospital)
        );
    }

    @Transactional
    public HospitalProfileResponseDto rejectHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setVerificationStatus(
                VerificationStatus.REJECTED
        );

        return mapToResponse(
                hospitalRepository.save(hospital)
        );
    }

    @Transactional
    public void deactivateHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setActive(false);

        hospitalRepository.save(hospital);
    }

    @Transactional
    public void activateHospital(
            Long hospitalId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        hospital.setActive(true);

        hospitalRepository.save(hospital);
    }

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