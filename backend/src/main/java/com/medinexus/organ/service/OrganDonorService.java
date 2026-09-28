package com.medinexus.organ.service;

import com.medinexus.organ.dto.OrganDonorCreateRequest;
import com.medinexus.organ.dto.OrganDonorResponseDto;
import com.medinexus.organ.entity.OrganDonor;
import com.medinexus.organ.entity.OrganDonorStatus;
import com.medinexus.organ.repository.OrganDonorRepository;
import com.medinexus.user.entity.PatientProfile;
import com.medinexus.user.entity.User;
import com.medinexus.user.repository.PatientProfileRepository;
import com.medinexus.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganDonorService {

    private final OrganDonorRepository organDonorRepository;
    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;

    // =========================================================
    // PATIENT - REGISTER AS ORGAN DONOR
    // =========================================================

    public OrganDonorResponseDto registerAsDonor(
            OrganDonorCreateRequest request,
            Authentication authentication
    ) {

        PatientProfile patient = getAuthenticatedPatient(authentication);

        if (organDonorRepository.existsByPatientId(patient.getId())) {
            throw new RuntimeException(
                    "You are already registered as an organ donor"
            );
        }

        OrganDonor donor = OrganDonor.builder()
                .patient(patient)
                .organTypes(request.getOrganTypes())
                .donationType(request.getDonationType())
                .medicalHistory(request.getMedicalHistory())
                .medicalConditions(request.getMedicalConditions())
                .currentMedications(request.getCurrentMedications())
                .previousSurgeries(request.getPreviousSurgeries())
                .allergies(request.getAllergies())
                .additionalMedicalNotes(
                        request.getAdditionalMedicalNotes()
                )
                .emergencyContactName(
                        request.getEmergencyContactName()
                )
                .emergencyContactRelation(
                        request.getEmergencyContactRelation()
                )
                .emergencyContactNumber(
                        request.getEmergencyContactNumber()
                )
                .consent(request.getConsent())
                .medicalDocumentUrl(
                        request.getMedicalDocumentUrl()
                )
                .status(OrganDonorStatus.PENDING)
                .build();

        OrganDonor savedDonor =
                organDonorRepository.save(donor);

        return mapToResponse(savedDonor);
    }


    // =========================================================
    // PATIENT - VIEW MY DONATION STATUS
    // =========================================================

    public OrganDonorResponseDto getMyDonationStatus(
            Authentication authentication
    ) {

        PatientProfile patient =
                getAuthenticatedPatient(authentication);

        OrganDonor donor = organDonorRepository
                .findByPatientId(patient.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "You are not registered as an organ donor"
                        ));

        return mapToResponse(donor);
    }


    // =========================================================
    // ADMIN - VIEW ALL DONORS
    // =========================================================

    public List<OrganDonorResponseDto> getAllDonors() {

        return organDonorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // ADMIN - APPROVE DONOR
    // =========================================================

    public OrganDonorResponseDto approveDonor(Long donorId) {

        OrganDonor donor = getDonor(donorId);

        if (donor.getStatus() != OrganDonorStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending donors can be approved"
            );
        }

        donor.setStatus(OrganDonorStatus.APPROVED);

        return mapToResponse(
                organDonorRepository.save(donor)
        );
    }


    // =========================================================
    // ADMIN - REJECT DONOR
    // =========================================================

    public OrganDonorResponseDto rejectDonor(Long donorId) {

        OrganDonor donor = getDonor(donorId);

        if (donor.getStatus() != OrganDonorStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending donors can be rejected"
            );
        }

        donor.setStatus(OrganDonorStatus.REJECTED);

        return mapToResponse(
                organDonorRepository.save(donor)
        );
    }


    // =========================================================
    // ADMIN - ACTIVATE APPROVED DONOR
    // =========================================================

    public OrganDonorResponseDto activateDonor(Long donorId) {

        OrganDonor donor = getDonor(donorId);

        if (donor.getStatus() != OrganDonorStatus.APPROVED) {
            throw new RuntimeException(
                    "Only approved donors can be activated"
            );
        }

        donor.setStatus(OrganDonorStatus.ACTIVE);

        return mapToResponse(
                organDonorRepository.save(donor)
        );
    }


    // =========================================================
    // ADMIN - WITHDRAW ACTIVE DONOR
    // =========================================================

    public OrganDonorResponseDto withdrawDonor(Long donorId) {

        OrganDonor donor = getDonor(donorId);

        if (donor.getStatus() != OrganDonorStatus.ACTIVE) {
            throw new RuntimeException(
                    "Only active donors can be withdrawn"
            );
        }

        donor.setStatus(OrganDonorStatus.WITHDRAWN);

        return mapToResponse(
                organDonorRepository.save(donor)
        );
    }


    // =========================================================
    // FIND DONOR
    // =========================================================

    private OrganDonor getDonor(Long donorId) {

        return organDonorRepository.findById(donorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Organ donor not found"
                        ));
    }


    // =========================================================
    // GET AUTHENTICATED PATIENT
    // =========================================================

    private PatientProfile getAuthenticatedPatient(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));

        return patientProfileRepository.findById(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient profile not found"
                        ));
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private OrganDonorResponseDto mapToResponse(
            OrganDonor donor
    ) {

        return OrganDonorResponseDto.builder()
                .id(donor.getId())
                .patientId(donor.getPatient().getId())
                .organTypes(donor.getOrganTypes())
                .donationType(donor.getDonationType())
                .medicalHistory(donor.getMedicalHistory())
                .medicalConditions(
                        donor.getMedicalConditions()
                )
                .currentMedications(
                        donor.getCurrentMedications()
                )
                .previousSurgeries(
                        donor.getPreviousSurgeries()
                )
                .allergies(
                        donor.getAllergies()
                )
                .additionalMedicalNotes(
                        donor.getAdditionalMedicalNotes()
                )
                .emergencyContactName(
                        donor.getEmergencyContactName()
                )
                .emergencyContactRelation(
                        donor.getEmergencyContactRelation()
                )
                .emergencyContactNumber(
                        donor.getEmergencyContactNumber()
                )
                .consent(
                        donor.getConsent()
                )
                .medicalDocumentUrl(
                        donor.getMedicalDocumentUrl()
                )
                .status(
                        donor.getStatus()
                )
                .createdAt(
                        donor.getCreatedAt()
                )
                .updatedAt(
                        donor.getUpdatedAt()
                )
                .build();
    }
}