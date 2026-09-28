package com.medinexus.user.service;

import com.medinexus.user.dto.PatientProfileRequestDto;
import com.medinexus.user.dto.PatientProfileResponseDto;
import com.medinexus.user.entity.PatientProfile;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.PatientProfileRepository;
import com.medinexus.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.medinexus.user.entity.Role;


@Service
public class PatientProfileService {

    private final PatientProfileRepository patientProfileRepository;
    private final UserRepository userRepository;

    public PatientProfileService(
            PatientProfileRepository patientProfileRepository,
            UserRepository userRepository) {

        this.patientProfileRepository = patientProfileRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE PATIENT PROFILE
    // =========================================================

    public PatientProfileResponseDto createProfile(
            Long userId,
            PatientProfileRequestDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException("Only patients can create a patient profile");
        }

        if (patientProfileRepository.existsById(userId)) {
            throw new RuntimeException("Patient profile already exists");
        }

        PatientProfile profile = new PatientProfile();

        profile.setUser(user);
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setGender(dto.getGender());
        profile.setBloodGroup(dto.getBloodGroup());
        profile.setAddress(dto.getAddress());

        PatientProfile savedProfile =
                patientProfileRepository.save(profile);

        return mapToResponseDto(savedProfile);
    }


    // =========================================================
    // GET PATIENT PROFILE
    // =========================================================
    public PatientProfileResponseDto getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException(
                    "Only patients can access a patient profile");
        }

        PatientProfile profile =
                patientProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"));

        return mapToResponseDto(profile);
    }
    // =========================================================
    // UPDATE PATIENT PROFILE
    // =========================================================

    public PatientProfileResponseDto updateProfile(
            Long userId,
            PatientProfileRequestDto dto) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException(
                    "Only patients can update a patient profile");
        }

        PatientProfile profile =
                patientProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"));

        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setGender(dto.getGender());
        profile.setBloodGroup(dto.getBloodGroup());
        profile.setAddress(dto.getAddress());

        PatientProfile updatedProfile =
                patientProfileRepository.save(profile);

        return mapToResponseDto(updatedProfile);
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private PatientProfileResponseDto mapToResponseDto(
            PatientProfile profile) {

        return PatientProfileResponseDto.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())

                // Account information
                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .phone(profile.getUser().getPhone())

                // Health information
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .bloodGroup(profile.getBloodGroup())
                .address(profile.getAddress())

                .build();
    }
}