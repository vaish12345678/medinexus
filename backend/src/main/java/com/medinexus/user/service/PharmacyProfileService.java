package com.medinexus.user.service;

import com.medinexus.user.dto.PharmacyProfileRequestDto;
import com.medinexus.user.dto.PharmacyProfileResponseDto;
import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.PharmacyProfileRepository;
import com.medinexus.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyProfileService {

    private final PharmacyProfileRepository pharmacyProfileRepository;
    private final UserRepository userRepository;


    // ============================================================
    // CREATE PHARMACY PROFILE
    // ============================================================

    @Transactional
    public PharmacyProfileResponseDto createProfile(
            Long userId,
            PharmacyProfileRequestDto dto
    ) {

        // 1. Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // 2. Check user role
        if (user.getRole() != Role.PHARMACY) {

            throw new RuntimeException(
                    "Only pharmacy users can create a pharmacy profile"
            );
        }


        // 3. Check whether profile already exists
        if (pharmacyProfileRepository.existsById(userId)) {

            throw new RuntimeException(
                    "Pharmacy profile already exists"
            );
        }


        // 4. Check duplicate license
        if (dto.getLicenseUrl() != null
                && !dto.getLicenseUrl().isBlank()
                && pharmacyProfileRepository
                .existsByLicenseUrl(dto.getLicenseUrl())) {

            throw new RuntimeException(
                    "This pharmacy license is already registered"
            );
        }


        // 5. Create pharmacy profile
        PharmacyProfile pharmacy = new PharmacyProfile();

        pharmacy.setId(userId);
        pharmacy.setUser(user);
        pharmacy.setPharmacyName(dto.getPharmacyName());
        pharmacy.setAddress(dto.getAddress());
        pharmacy.setLicenseUrl(dto.getLicenseUrl());


        // 6. New pharmacy must be verified by admin
        pharmacy.setVerificationStatus(
                VerificationStatus.PENDING
        );


        // 7. Save
        PharmacyProfile saved =
                pharmacyProfileRepository.save(pharmacy);


        // 8. Convert entity → DTO
        return mapToResponseDto(saved);
    }


    // ============================================================
    // GET MY PHARMACY PROFILE
    // ============================================================

    @Transactional(readOnly = true)
    public PharmacyProfileResponseDto getMyProfile(
            Long userId
    ) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy profile not found"
                                )
                        );

        return mapToResponseDto(pharmacy);
    }


    // ============================================================
    // GET PHARMACY BY ID
    // ============================================================

    @Transactional(readOnly = true)
    public PharmacyProfileResponseDto getProfileById(
            Long pharmacyId
    ) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy profile not found"
                                )
                        );

        return mapToResponseDto(pharmacy);
    }


    // ============================================================
    // GET VERIFIED PHARMACIES
    // ============================================================

    @Transactional(readOnly = true)
    public List<PharmacyProfileResponseDto>
    getVerifiedPharmacies() {

        return pharmacyProfileRepository
                .findByVerificationStatus(
                        VerificationStatus.VERIFIED
                )
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // ADMIN - GET PENDING PHARMACIES
    // ============================================================

    @Transactional(readOnly = true)
    public List<PharmacyProfileResponseDto>
    getPendingPharmacies() {

        return pharmacyProfileRepository
                .findByVerificationStatus(
                        VerificationStatus.PENDING
                )
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // ADMIN - VERIFY PHARMACY
    // ============================================================

    @Transactional
    public PharmacyProfileResponseDto verifyPharmacy(
            Long pharmacyId
    ) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy profile not found"
                                )
                        );


        // Already verified
        if (pharmacy.getVerificationStatus()
                == VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Pharmacy is already verified"
            );
        }


        // Change status
        pharmacy.setVerificationStatus(
                VerificationStatus.VERIFIED
        );


        PharmacyProfile updated =
                pharmacyProfileRepository.save(pharmacy);


        return mapToResponseDto(updated);
    }


    // ============================================================
    // ADMIN - REJECT PHARMACY
    // ============================================================

    @Transactional
    public PharmacyProfileResponseDto rejectPharmacy(
            Long pharmacyId
    ) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy profile not found"
                                )
                        );


        // Already rejected
        if (pharmacy.getVerificationStatus()
                == VerificationStatus.REJECTED) {

            throw new RuntimeException(
                    "Pharmacy is already rejected"
            );
        }


        // Change status
        pharmacy.setVerificationStatus(
                VerificationStatus.REJECTED
        );


        PharmacyProfile updated =
                pharmacyProfileRepository.save(pharmacy);


        return mapToResponseDto(updated);
    }


    // ============================================================
    // ENTITY → RESPONSE DTO
    // ============================================================

    private PharmacyProfileResponseDto mapToResponseDto(
            PharmacyProfile pharmacy
    ) {

        return PharmacyProfileResponseDto.builder()
                .id(pharmacy.getId())
                .userId(pharmacy.getUser().getId())
                .pharmacyName(pharmacy.getPharmacyName())
                .address(pharmacy.getAddress())
                .verificationStatus(
                        pharmacy.getVerificationStatus()
                )
                .build();
    }
}