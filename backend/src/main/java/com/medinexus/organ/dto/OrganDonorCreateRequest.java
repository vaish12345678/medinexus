package com.medinexus.organ.dto;

import com.medinexus.organ.entity.DonationType;
import com.medinexus.organ.entity.OrganType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganDonorCreateRequest {

    @NotEmpty(message = "Please select at least one organ")
    private Set<OrganType> organTypes;

    @NotNull(message = "Donation type is required")
    private DonationType donationType;

    @NotBlank(message = "Medical history is required")
    private String medicalHistory;

    private String medicalConditions;

    private String currentMedications;

    private String previousSurgeries;

    private String allergies;

    private String additionalMedicalNotes;

    @NotBlank(message = "Emergency contact name is required")
    private String emergencyContactName;

    @NotBlank(message = "Emergency contact relationship is required")
    private String emergencyContactRelation;

    @NotBlank(message = "Emergency contact number is required")
    private String emergencyContactNumber;

    @AssertTrue(message = "You must provide consent to register as an organ donor")
    private Boolean consent;

    private String medicalDocumentUrl;
}