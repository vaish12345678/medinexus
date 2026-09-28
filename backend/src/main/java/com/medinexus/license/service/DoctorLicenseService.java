package com.medinexus.license.service;

import com.medinexus.cloudinary.CloudinaryService;
import com.medinexus.license.dto.DoctorLicenseResponseDto;
import com.medinexus.license.dto.DoctorLicenseVerificationDto;
import com.medinexus.license.entity.DoctorLicense;
import com.medinexus.license.repository.DoctorLicenseRepository;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.DoctorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorLicenseService {

    private final DoctorLicenseRepository doctorLicenseRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final CloudinaryService cloudinaryService;

    public DoctorLicenseService(
            DoctorLicenseRepository doctorLicenseRepository,
            DoctorProfileRepository doctorProfileRepository,
            CloudinaryService cloudinaryService) {

        this.doctorLicenseRepository = doctorLicenseRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.cloudinaryService = cloudinaryService;
    }


    // =========================================================
    // DOCTOR SUBMITS LICENSE
    // =========================================================

    @Transactional
    public DoctorLicenseResponseDto submitLicense(
            Long doctorId,
            String licenseNumber,
            MultipartFile document) {

        // -----------------------------------------------------
        // 1. Find doctor
        // -----------------------------------------------------

        DoctorProfile doctor =
                doctorProfileRepository.findById(doctorId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                )
                        );


        // -----------------------------------------------------
        // 2. Check duplicate license number
        // -----------------------------------------------------

        if (doctorLicenseRepository
                .existsByLicenseNumber(licenseNumber)) {

            throw new RuntimeException(
                    "A license with this license number already exists"
            );
        }


        // -----------------------------------------------------
        // 3. Check document
        // -----------------------------------------------------

        if (document == null || document.isEmpty()) {

            throw new RuntimeException(
                    "License document is required"
            );
        }


        // -----------------------------------------------------
        // 4. Upload document to Cloudinary
        // -----------------------------------------------------

        String documentUrl =
                cloudinaryService.uploadFile(
                        document,
                        "medinexus/doctor-licenses"
                );


        // -----------------------------------------------------
        // 5. Create license
        // -----------------------------------------------------

        DoctorLicense license =
                DoctorLicense.builder()
                        .doctor(doctor)
                        .licenseNumber(licenseNumber)
                        .documentUrl(documentUrl)
                        .verificationStatus(
                                VerificationStatus.PENDING
                        )
                        .build();


        // -----------------------------------------------------
        // 6. Save
        // -----------------------------------------------------

        DoctorLicense savedLicense =
                doctorLicenseRepository.save(license);


        return mapToResponseDto(savedLicense);
    }


    // =========================================================
    // DOCTOR GETS OWN LICENSES
    // =========================================================

    @Transactional(readOnly = true)
    public List<DoctorLicenseResponseDto> getDoctorLicenses(
            Long doctorId) {

        List<DoctorLicense> licenses =
                doctorLicenseRepository.findByDoctorId(
                        doctorId
                );

        return licenses.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET LICENSE BY ID
    //
    // Doctor -> only their own license
    // Admin  -> any license
    // =========================================================

    @Transactional(readOnly = true)
    public DoctorLicenseResponseDto getLicense(
            Long licenseId,
            Long userId,
            boolean isAdmin) {

        DoctorLicense license =
                doctorLicenseRepository.findById(licenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "License not found"
                                )
                        );


        // -----------------------------------------------------
        // Admin can access any doctor license
        // -----------------------------------------------------

        if (isAdmin) {
            return mapToResponseDto(license);
        }


        // -----------------------------------------------------
        // Doctor can access only their own license
        // -----------------------------------------------------

        if (!license.getDoctor()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to view this license"
            );
        }


        return mapToResponseDto(license);
    }


    // =========================================================
    // ADMIN GETS PENDING LICENSES
    // =========================================================

    @Transactional(readOnly = true)
    public List<DoctorLicenseResponseDto> getPendingLicenses() {

        List<DoctorLicense> licenses =
                doctorLicenseRepository
                        .findByVerificationStatus(
                                VerificationStatus.PENDING
                        );

        return licenses.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // =========================================================
    // ADMIN VERIFIES / REJECTS LICENSE
    // =========================================================

    @Transactional
    public DoctorLicenseResponseDto verifyLicense(
            Long licenseId,
            DoctorLicenseVerificationDto dto) {

        DoctorLicense license =
                doctorLicenseRepository.findById(licenseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "License not found"
                                )
                        );


        // -----------------------------------------------------
        // Only pending licenses can be verified
        // -----------------------------------------------------

        if (license.getVerificationStatus()
                != VerificationStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending licenses can be verified"
            );
        }


        // -----------------------------------------------------
        // Only VERIFIED or REJECTED are valid here
        // -----------------------------------------------------

        if (dto.getVerificationStatus()
                != VerificationStatus.VERIFIED
                &&
                dto.getVerificationStatus()
                        != VerificationStatus.REJECTED) {

            throw new RuntimeException(
                    "Verification status must be VERIFIED or REJECTED"
            );
        }


        // -----------------------------------------------------
        // VERIFIED
        // -----------------------------------------------------

        if (dto.getVerificationStatus()
                == VerificationStatus.VERIFIED) {

            license.setVerificationStatus(
                    VerificationStatus.VERIFIED
            );

            license.setVerifiedAt(
                    LocalDateTime.now()
            );

            license.setRejectionReason(null);


            // Update doctor profile status
            DoctorProfile doctor =
                    license.getDoctor();

            doctor.setVerificationStatus(
                    VerificationStatus.VERIFIED
            );

            doctorProfileRepository.save(doctor);
        }


        // -----------------------------------------------------
        // REJECTED
        // -----------------------------------------------------

        else {

            if (dto.getRejectionReason() == null ||
                    dto.getRejectionReason()
                            .trim()
                            .isEmpty()) {

                throw new RuntimeException(
                        "Rejection reason is required"
                );
            }


            license.setVerificationStatus(
                    VerificationStatus.REJECTED
            );

            license.setRejectionReason(
                    dto.getRejectionReason()
            );

            license.setVerifiedAt(null);


            // Doctor profile remains unverified
            DoctorProfile doctor =
                    license.getDoctor();

            doctor.setVerificationStatus(
                    VerificationStatus.REJECTED
            );

            doctorProfileRepository.save(doctor);
        }


        // -----------------------------------------------------
        // Save updated license
        // -----------------------------------------------------

        DoctorLicense updatedLicense =
                doctorLicenseRepository.save(license);


        return mapToResponseDto(updatedLicense);
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================

    private DoctorLicenseResponseDto mapToResponseDto(
            DoctorLicense license) {

        return DoctorLicenseResponseDto.builder()
                .id(license.getId())

                .doctorId(
                        license.getDoctor().getId()
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