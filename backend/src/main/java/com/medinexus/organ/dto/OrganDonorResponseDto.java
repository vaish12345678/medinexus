package com.medinexus.organ.dto;

import com.medinexus.organ.entity.DonationType;
import com.medinexus.organ.entity.OrganDonorStatus;
import com.medinexus.organ.entity.OrganType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganDonorResponseDto {

    private Long id;

    private Long patientId;

    private Set<OrganType> organTypes;

    private DonationType donationType;

    private String medicalHistory;

    private String medicalConditions;

    private String currentMedications;

    private String previousSurgeries;

    private String allergies;

    private String additionalMedicalNotes;

    private String emergencyContactName;

    private String emergencyContactRelation;

    private String emergencyContactNumber;

    private Boolean consent;

    private String medicalDocumentUrl;

    private OrganDonorStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}