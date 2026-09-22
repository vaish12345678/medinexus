package com.medinexus.service;

import com.medinexus.Entity.SymptomCheck;
import com.medinexus.dto.GeminiSymptomResponseDto;
import com.medinexus.dto.SymptomCheckRequestDto;
import com.medinexus.dto.SymptomCheckResponseDto;
import com.medinexus.repository.SymptomCheckRepository;
import com.medinexus.user.entity.PatientProfile;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.PatientProfileRepository;
import com.medinexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SymptomCheckService {

    private final SymptomCheckRepository symptomCheckRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    @Transactional
    public SymptomCheckResponseDto checkSymptoms(
            Long userId,
            SymptomCheckRequestDto request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        PatientProfile patient =
                patientProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                ));

        GeminiSymptomResponseDto aiResponse =
                geminiService.analyzeSymptoms(
                        request.getSymptoms()
                );

        SymptomCheck symptomCheck =
                SymptomCheck.builder()
                        .patient(patient)
                        .symptoms(request.getSymptoms())
                        .recommendedSpecialization(
                                aiResponse.getRecommendedSpecialization()
                        )
                        .aiResponse(
                                aiResponse.getResponse()
                        )
                        .build();

        SymptomCheck saved =
                symptomCheckRepository.save(symptomCheck);

        return mapToResponseDto(saved);
    }

    @Transactional(readOnly = true)
    public List<SymptomCheckResponseDto> getMySymptomChecks(
            Long userId
    ) {

        PatientProfile patient =
                patientProfileRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                ));

        return symptomCheckRepository
                .findByPatientOrderByCreatedAtDesc(patient)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    private SymptomCheckResponseDto mapToResponseDto(
            SymptomCheck symptomCheck
    ) {

        return SymptomCheckResponseDto.builder()
                .id(symptomCheck.getId())
                .patientId(
                        symptomCheck.getPatient().getId()
                )
                .symptoms(
                        symptomCheck.getSymptoms()
                )
                .recommendedSpecialization(
                        symptomCheck.getRecommendedSpecialization()
                )
                .aiResponse(
                        symptomCheck.getAiResponse()
                )
                .createdAt(
                        symptomCheck.getCreatedAt()
                )
                .build();
    }
}