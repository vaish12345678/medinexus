package com.medinexus.user.service;

import com.medinexus.user.dto.DoctorProfileRequestDto;
import com.medinexus.user.dto.DoctorProfileResponseDto;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.DoctorProfileRepository;
import com.medinexus.user.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DoctorProfileService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;

    public DoctorProfileService(
            DoctorProfileRepository doctorProfileRepository,
            UserRepository userRepository) {

        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE DOCTOR PROFILE
    // =========================================================

    @Transactional
    public DoctorProfileResponseDto createProfile(
            Long userId,
            DoctorProfileRequestDto dto) {

        // 1. Find logged-in user
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // 2. Check whether user is actually a doctor
        if (user.getRole() != Role.DOCTOR) {
            throw new RuntimeException(
                    "Only users with DOCTOR role can create a doctor profile");
        }

        // 3. Check if profile already exists
        if (doctorProfileRepository.existsById(userId)) {
            throw new RuntimeException(
                    "Doctor profile already exists");
        }

        // 4. Create DoctorProfile
        DoctorProfile profile = DoctorProfile.builder()
                .id(userId)
                .user(user)
                .specialization(dto.getSpecialization())
                .experienceYears(dto.getExperienceYears())
                .consultationFee(dto.getConsultationFee())
                .verificationStatus(VerificationStatus.PENDING)
                .build();

        // 5. Save
        DoctorProfile savedProfile =
                doctorProfileRepository.save(profile);

        // 6. Convert entity → response DTO
        return mapToResponseDto(savedProfile);
    }


    // =========================================================
    // GET DOCTOR PROFILE
    // =========================================================

    public DoctorProfileResponseDto getProfile(Long userId) {

        DoctorProfile profile =
                doctorProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"));

        return mapToResponseDto(profile);
    }


    // =========================================================
    // UPDATE DOCTOR PROFILE
    // =========================================================

    @Transactional
    public DoctorProfileResponseDto updateProfile(
            Long userId,
            DoctorProfileRequestDto dto) {

        DoctorProfile profile =
                doctorProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"));

        profile.setSpecialization(dto.getSpecialization());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setConsultationFee(dto.getConsultationFee());

        DoctorProfile updatedProfile =
                doctorProfileRepository.save(profile);

        return mapToResponseDto(updatedProfile);
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private DoctorProfileResponseDto mapToResponseDto(
            DoctorProfile profile) {

        return DoctorProfileResponseDto.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .specialization(profile.getSpecialization())
                .experienceYears(profile.getExperienceYears())
                .consultationFee(profile.getConsultationFee())
                .verificationStatus(
                        profile.getVerificationStatus())
                .build();
    }
}