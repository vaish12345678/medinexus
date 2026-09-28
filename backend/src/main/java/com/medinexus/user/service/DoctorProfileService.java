package com.medinexus.user.service;

import com.medinexus.user.dto.DoctorProfileRequestDto;
import com.medinexus.user.dto.DoctorProfileResponseDto;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.DoctorProfileRepository;
import com.medinexus.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.DOCTOR) {
            throw new RuntimeException(
                    "Only users with DOCTOR role can create a doctor profile");
        }

        if (doctorProfileRepository.existsById(userId)) {
            throw new RuntimeException(
                    "Doctor profile already exists");
        }

        DoctorProfile profile = new DoctorProfile();

        profile.setUser(user);
        profile.setSpecialization(dto.getSpecialization());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setConsultationFee(dto.getConsultationFee());
        profile.setQualification(dto.getQualification());
        profile.setBio(dto.getBio());
        profile.setVerificationStatus(VerificationStatus.PENDING);

        DoctorProfile savedProfile =
                doctorProfileRepository.save(profile);

        return mapToResponseDto(savedProfile);
    }

    // =========================================================
    // GET DOCTOR PROFILE
    // =========================================================

    @Transactional(readOnly = true)
    public DoctorProfileResponseDto getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.DOCTOR) {
            throw new RuntimeException(
                    "Only doctors can access a doctor profile");
        }

        DoctorProfile profile =
                doctorProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Doctor profile not found"));

        return mapToResponseDto(profile);
    }
    @Transactional(readOnly = true)
    public List<DoctorProfileResponseDto> getDoctorsBySpecialization(
            String specialization) {

        List<DoctorProfile> doctors =
                doctorProfileRepository
                        .findBySpecializationIgnoreCaseAndVerificationStatus(
                                specialization,
                                VerificationStatus.VERIFIED
                        );

        return doctors.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    // =========================================================
    // UPDATE DOCTOR PROFILE
    // =========================================================

    @Transactional
    public DoctorProfileResponseDto updateProfile(
            Long userId,
            DoctorProfileRequestDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.DOCTOR) {
            throw new RuntimeException(
                    "Only doctors can update a doctor profile");
        }

        DoctorProfile profile =
                doctorProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"));

        // Doctors can update their professional information
        profile.setSpecialization(dto.getSpecialization());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setConsultationFee(dto.getConsultationFee());
        profile.setQualification(dto.getQualification());
        profile.setBio(dto.getBio());

        // IMPORTANT:
        // verificationStatus is intentionally NOT changed here.
        // It is controlled by the doctor-license verification process.

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

                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .phone(profile.getUser().getPhone())

                .specialization(profile.getSpecialization())
                .experienceYears(profile.getExperienceYears())
                .consultationFee(profile.getConsultationFee())

                .qualification(profile.getQualification())
                .bio(profile.getBio())

                .verificationStatus(
                        profile.getVerificationStatus())
                .build();
    }
}