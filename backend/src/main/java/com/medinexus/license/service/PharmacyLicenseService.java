package com.medinexus.license.service;

import com.medinexus.cloudinary.CloudinaryService;
import com.medinexus.license.dto.PharmacyLicenseResponseDto;
import com.medinexus.license.dto.PharmacyLicenseVerificationDto;
import com.medinexus.license.entity.PharmacyLicense;
import com.medinexus.license.repository.PharmacyLicenseRepository;
import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.PharmacyProfileRepository;
import com.medinexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyLicenseService {

    private final PharmacyLicenseRepository pharmacyLicenseRepository;
    private final PharmacyProfileRepository pharmacyProfileRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;


    // =========================================================
    // PHARMACY SUBMITS LICENSE
    // =========================================================

    @Transactional
    public PharmacyLicenseResponseDto submitLicense(
            Long userId,
            String licenseNumber,
            MultipartFile document) {

        // -----------------------------------------------------
        // 1. Find user
        // -----------------------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));


        // -----------------------------------------------------
        // 2. Find pharmacy profile
        // -----------------------------------------------------

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(user.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy profile not found"
                                ));


        // -----------------------------------------------------
        // 3. Validate license number
        // -----------------------------------------------------

        if (licenseNumber == null ||
                licenseNumber.trim().isEmpty()) {

            throw new RuntimeException(
                    "License number is required"
            );
        }


        // -----------------------------------------------------
        // 4. Check duplicate license number
        // -----------------------------------------------------

        if (pharmacyLicenseRepository
                .findByLicenseNumber(licenseNumber)
                .isPresent()) {

            throw new RuntimeException(
                    "License number already exists"
            );
        }


        // -----------------------------------------------------
        // 5. Validate document
        // -----------------------------------------------------

        if (document == null || document.isEmpty()) {

            throw new RuntimeException(
                    "License document is required"
            );
        }


        // -----------------------------------------------------
        // 6. Upload document to Cloudinary
        // -----------------------------------------------------

        String documentUrl =
                cloudinaryService.uploadFile(
                        document,
                        "medinexus/pharmacy-licenses"
                );


        // -----------------------------------------------------
        // 7. Create license
        // -----------------------------------------------------

        PharmacyLicense license =
                PharmacyLicense.builder()
                        .pharmacy(pharmacy)
                        .licenseNumber(licenseNumber)
                        .documentUrl(documentUrl)
                        .verificationStatus(
                                VerificationStatus.PENDING
                        )
                        .build();


        // -----------------------------------------------------
        // 8. Save
        // -----------------------------------------------------

        PharmacyLicense saved =
                pharmacyLicenseRepository.save(license);


        return mapToResponse(saved);
    }


    // =========================================================
    // PHARMACY GETS OWN LICENSES
    // =========================================================

    @Transactional(readOnly = true)
    public List<PharmacyLicenseResponseDto> getMyLicenses(
            Long userId) {

        return pharmacyLicenseRepository
                .findByPharmacyId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET LICENSE BY ID
    //
    // Pharmacy -> only own license
    // Admin    -> any pharmacy license
    // =========================================================

    @Transactional(readOnly = true)
    public PharmacyLicenseResponseDto getLicense(
            Long licenseId,
            Long userId,
            boolean isAdmin) {

        PharmacyLicense license =
                pharmacyLicenseRepository.findById(licenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy license not found"
                                ));


        // -----------------------------------------------------
        // Admin can access any license
        // -----------------------------------------------------

        if (isAdmin) {
            return mapToResponse(license);
        }


        // -----------------------------------------------------
        // Pharmacy can access only its own license
        // -----------------------------------------------------

        if (!license.getPharmacy()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to view this license"
            );
        }


        return mapToResponse(license);
    }


    // =========================================================
    // ADMIN GETS PENDING LICENSES
    // =========================================================

    @Transactional(readOnly = true)
    public List<PharmacyLicenseResponseDto>
    getPendingLicenses() {

        return pharmacyLicenseRepository
                .findByVerificationStatus(
                        VerificationStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // ADMIN VERIFIES / REJECTS LICENSE
    // =========================================================

    @Transactional
    public PharmacyLicenseResponseDto verifyLicense(
            Long licenseId,
            PharmacyLicenseVerificationDto dto) {

        PharmacyLicense license =
                pharmacyLicenseRepository.findById(licenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy license not found"
                                ));


        // -----------------------------------------------------
        // Only pending licenses can be processed
        // -----------------------------------------------------

        if (license.getVerificationStatus()
                != VerificationStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending licenses can be verified or rejected"
            );
        }


        // -----------------------------------------------------
        // Validate status
        // -----------------------------------------------------

        VerificationStatus status =
                dto.getVerificationStatus();

        if (status != VerificationStatus.VERIFIED
                && status != VerificationStatus.REJECTED) {

            throw new RuntimeException(
                    "Status must be VERIFIED or REJECTED"
            );
        }


        // -----------------------------------------------------
        // Rejection requires a reason
        // -----------------------------------------------------

        if (status == VerificationStatus.REJECTED
                && (dto.getRejectionReason() == null
                || dto.getRejectionReason().isBlank())) {

            throw new RuntimeException(
                    "Rejection reason is required"
            );
        }


        // -----------------------------------------------------
        // VERIFIED
        // -----------------------------------------------------

        if (status == VerificationStatus.VERIFIED) {

            license.setVerificationStatus(
                    VerificationStatus.VERIFIED
            );

            license.setVerifiedAt(
                    LocalDateTime.now()
            );

            license.setRejectionReason(null);


            // Update pharmacy profile
            PharmacyProfile pharmacy =
                    license.getPharmacy();

            pharmacy.setVerificationStatus(
                    VerificationStatus.VERIFIED
            );

            pharmacyProfileRepository.save(pharmacy);
        }


        // -----------------------------------------------------
        // REJECTED
        // -----------------------------------------------------

        else {

            license.setVerificationStatus(
                    VerificationStatus.REJECTED
            );

            license.setVerifiedAt(null);

            license.setRejectionReason(
                    dto.getRejectionReason()
            );


            // Update pharmacy profile
            PharmacyProfile pharmacy =
                    license.getPharmacy();

            pharmacy.setVerificationStatus(
                    VerificationStatus.REJECTED
            );

            pharmacyProfileRepository.save(pharmacy);
        }


        // -----------------------------------------------------
        // Save license
        // -----------------------------------------------------

        PharmacyLicense saved =
                pharmacyLicenseRepository.save(license);


        return mapToResponse(saved);
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private PharmacyLicenseResponseDto mapToResponse(
            PharmacyLicense license) {

        return PharmacyLicenseResponseDto.builder()
                .id(license.getId())

                .pharmacyId(
                        license.getPharmacy().getId()
                )

                .licenseNumber(
                        license.getLicenseNumber()
                )

                .documentUrl(
                        license.getDocumentUrl()
                )

                .verificationStatus(
                        license.getVerificationStatus()
                )

                .submittedAt(
                        license.getSubmittedAt()
                )

                .verifiedAt(
                        license.getVerifiedAt()
                )

                .rejectionReason(
                        license.getRejectionReason()
                )

                .build();
    }
}