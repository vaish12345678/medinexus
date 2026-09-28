package com.medinexus.organ.dto;

import com.medinexus.organ.entity.OrganRequestUrgency;
import com.medinexus.organ.entity.OrganType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganRequestCreateRequest {

    // =========================================================
    // ORGAN REQUIREMENT
    // =========================================================

    @NotNull(message = "Organ type is required")
    private OrganType organType;

    @NotBlank(message = "Blood group is required")
    private String bloodGroup;

    @NotNull(message = "Urgency is required")
    private OrganRequestUrgency urgency;


    // =========================================================
    // MEDICAL INFORMATION
    // =========================================================

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    @NotBlank(message = "Transplant reason is required")
    private String transplantReason;

    private String currentTreatment;


    // =========================================================
    // DOCTOR / HOSPITAL INFORMATION
    // =========================================================

    @NotBlank(message = "Doctor name is required")
    private String doctorName;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotBlank(message = "Hospital city is required")
    private String hospitalCity;

    @NotBlank(message = "Doctor contact is required")
    private String doctorContact;


    // =========================================================
    // SUPPORTING INFORMATION
    // =========================================================

    private String medicalDocumentUrl;

    private String additionalNotes;
}