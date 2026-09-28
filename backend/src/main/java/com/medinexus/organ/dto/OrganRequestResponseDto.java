package com.medinexus.organ.dto;

import com.medinexus.organ.entity.OrganRequestStatus;
import com.medinexus.organ.entity.OrganRequestUrgency;
import com.medinexus.organ.entity.OrganType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganRequestResponseDto {

    private Long id;

    private Long patientId;

    // =========================================================
    // ORGAN REQUIREMENT
    // =========================================================

    private OrganType organType;

    private String bloodGroup;

    private OrganRequestUrgency urgency;


    // =========================================================
    // MEDICAL INFORMATION
    // =========================================================

    private String diagnosis;

    private String transplantReason;

    private String currentTreatment;


    // =========================================================
    // DOCTOR / HOSPITAL INFORMATION
    // =========================================================

    private String doctorName;

    private String hospitalName;

    private String hospitalCity;

    private String doctorContact;


    // =========================================================
    // SUPPORTING INFORMATION
    // =========================================================

    private String medicalDocumentUrl;

    private String additionalNotes;


    // =========================================================
    // STATUS / TIMESTAMPS
    // =========================================================

    private OrganRequestStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}