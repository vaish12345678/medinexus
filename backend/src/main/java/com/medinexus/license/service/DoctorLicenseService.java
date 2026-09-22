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

    @Transactional
    public DoctorLicenseResponseDto submitLicense(
            Long doctorId,
            String licenseNumber,
            MultipartFile document) {

        // 1. Find doctor
        DoctorProfile doctor = doctorProfileRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));

        // 2. Check duplicate license number
        if (doctorLicenseRepository.existsByLicenseNumber(licenseNumber)) {
            throw new RuntimeException(
                    "A license with this license number already exists");
        }

        // 3. Check file
        if (document == null || document.isEmpty()) {
            throw new RuntimeException("License document is required");
        }

        // 4. Upload document to Cloudinary
        String documentUrl = cloudinaryService.uploadFile(
                document,
                "medinexus/doctor-licenses"
        );

        // 5. Create license record
        DoctorLicense license = DoctorLicense.builder()
                .doctor(doctor)
                .licenseNumber(licenseNumber)
                .documentUrl(documentUrl)
                .verificationStatus(VerificationStatus.PENDING)
                .build();

        // 6. Save in database
        DoctorLicense savedLicense =
                doctorLicenseRepository.save(license);

        return mapToResponseDto(savedLicense);
    }

    public List<DoctorLicenseResponseDto> getDoctorLicenses(Long doctorId) {

        List<DoctorLicense> licenses =
                doctorLicenseRepository.findByDoctorId(doctorId);

        return licenses.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public DoctorLicenseResponseDto getLicense(Long licenseId) {

        DoctorLicense license =
                doctorLicenseRepository.findById(licenseId)
                        .orElseThrow(() ->
                                new RuntimeException("License not found"));

        return mapToResponseDto(license);
    }

    @Transactional
    public DoctorLicenseResponseDto verifyLicense(
            Long licenseId,
            DoctorLicenseVerificationDto dto) {

        DoctorLicense license =
                doctorLicenseRepository.findById(licenseId)
                        .orElseThrow(() ->
                                new RuntimeException("License not found"));

        license.setVerificationStatus(dto.getVerificationStatus());

        if (dto.getVerificationStatus() == VerificationStatus.VERIFIED) {
            license.setVerifiedAt(LocalDateTime.now());
            license.setRejectionReason(null);

        } else if (dto.getVerificationStatus() == VerificationStatus.REJECTED) {
            license.setRejectionReason(dto.getRejectionReason());
            license.setVerifiedAt(null);
        }

        DoctorLicense updatedLicense =
                doctorLicenseRepository.save(license);

        return mapToResponseDto(updatedLicense);
    }

    private DoctorLicenseResponseDto mapToResponseDto(
            DoctorLicense license) {

        return DoctorLicenseResponseDto.builder()
                .id(license.getId())
                .doctorId(license.getDoctor().getId())
                .licenseNumber(license.getLicenseNumber())
                .documentUrl(license.getDocumentUrl())
                .verificationStatus(license.getVerificationStatus())
                .submittedAt(license.getSubmittedAt())
                .verifiedAt(license.getVerifiedAt())
                .rejectionReason(license.getRejectionReason())
                .build();
    }
}