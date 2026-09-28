package com.medinexus.organ.service;

import com.medinexus.organ.dto.OrganRequestCreateRequest;
import com.medinexus.organ.dto.OrganRequestResponseDto;
import com.medinexus.organ.entity.OrganRequest;
import com.medinexus.organ.entity.OrganRequestStatus;
import com.medinexus.organ.repository.OrganRequestRepository;
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
public class OrganRequestService {

    private final OrganRequestRepository organRequestRepository;
    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;


    // =========================================================
    // PATIENT - CREATE ORGAN REQUEST
    // =========================================================

    public OrganRequestResponseDto createRequest(
            OrganRequestCreateRequest request,
            Authentication authentication
    ) {

        PatientProfile patient =
                getAuthenticatedPatient(authentication);

        OrganRequest organRequest = OrganRequest.builder()
                .patient(patient)
                .organType(request.getOrganType())
                .bloodGroup(request.getBloodGroup())
                .urgency(request.getUrgency())
                .diagnosis(request.getDiagnosis())
                .transplantReason(request.getTransplantReason())
                .currentTreatment(request.getCurrentTreatment())
                .doctorName(request.getDoctorName())
                .hospitalName(request.getHospitalName())
                .hospitalCity(request.getHospitalCity())
                .doctorContact(request.getDoctorContact())
                .medicalDocumentUrl(
                        request.getMedicalDocumentUrl()
                )
                .additionalNotes(
                        request.getAdditionalNotes()
                )
                .status(OrganRequestStatus.PENDING)
                .build();
        System.out.println("BLOOD GROUP RECEIVED = [" + request.getBloodGroup() + "]");
        System.out.println("BLOOD GROUP LENGTH = " +
                (request.getBloodGroup() == null ? 0 : request.getBloodGroup().length()));
        OrganRequest savedRequest =
                organRequestRepository.save(organRequest);

        return mapToResponse(savedRequest);
    }


    // =========================================================
    // PATIENT - VIEW MY REQUESTS
    // =========================================================

    public List<OrganRequestResponseDto> getMyRequests(
            Authentication authentication
    ) {

        PatientProfile patient =
                getAuthenticatedPatient(authentication);

        return organRequestRepository
                .findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // ADMIN - VIEW ALL REQUESTS
    // =========================================================

    public List<OrganRequestResponseDto> getAllRequestsForAdmin() {

        return organRequestRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // ADMIN - APPROVE REQUEST
    // =========================================================

    public OrganRequestResponseDto approveRequest(
            Long requestId
    ) {

        OrganRequest request = getRequest(requestId);

        if (request.getStatus() != OrganRequestStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be approved"
            );
        }

        request.setStatus(OrganRequestStatus.APPROVED);

        return mapToResponse(
                organRequestRepository.save(request)
        );
    }


    // =========================================================
    // ADMIN - REJECT REQUEST
    // =========================================================

    public OrganRequestResponseDto rejectRequest(
            Long requestId
    ) {

        OrganRequest request = getRequest(requestId);

        if (request.getStatus() != OrganRequestStatus.PENDING) {
            throw new RuntimeException(
                    "Only pending requests can be rejected"
            );
        }

        request.setStatus(OrganRequestStatus.REJECTED);

        return mapToResponse(
                organRequestRepository.save(request)
        );
    }


    // =========================================================
    // DOCTOR - VIEW APPROVED REQUESTS
    // =========================================================

    public List<OrganRequestResponseDto>
    getApprovedRequestsForDoctors() {

        return organRequestRepository
                .findByStatusOrderByCreatedAtDesc(
                        OrganRequestStatus.APPROVED
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // FIND REQUEST
    // =========================================================

    private OrganRequest getRequest(Long requestId) {

        return organRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Organ request not found"
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

    private OrganRequestResponseDto mapToResponse(
            OrganRequest request
    ) {

        return OrganRequestResponseDto.builder()
                .id(request.getId())
                .patientId(request.getPatient().getId())

                .organType(request.getOrganType())
                .bloodGroup(request.getBloodGroup())
                .urgency(request.getUrgency())

                .diagnosis(request.getDiagnosis())
                .transplantReason(
                        request.getTransplantReason()
                )
                .currentTreatment(
                        request.getCurrentTreatment()
                )

                .doctorName(request.getDoctorName())
                .hospitalName(request.getHospitalName())
                .hospitalCity(request.getHospitalCity())
                .doctorContact(request.getDoctorContact())

                .medicalDocumentUrl(
                        request.getMedicalDocumentUrl()
                )
                .additionalNotes(
                        request.getAdditionalNotes()
                )

                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())

                .build();
    }
}