package com.medinexus.organ.entity;

import com.medinexus.user.entity.PatientProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "organ_donors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganDonor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private PatientProfile patient;

    /*
     * A donor can be willing to donate more than one organ.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "organ_donor_organs",
            joinColumns = @JoinColumn(name = "donor_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "organ_type", nullable = false)
    @Builder.Default
    private Set<OrganType> organTypes = new HashSet<>();

    /*
     * Donation intent/type.
     * This describes the donor's registration intent,
     * not medical/legal eligibility.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DonationType donationType;

    /*
     * Medical information provided by the patient.
     */
    @Column(length = 2000)
    private String medicalHistory;

    @Column(length = 1000)
    private String medicalConditions;

    @Column(length = 1000)
    private String currentMedications;

    @Column(length = 1000)
    private String previousSurgeries;

    @Column(length = 1000)
    private String allergies;

    @Column(length = 2000)
    private String additionalMedicalNotes;

    /*
     * Emergency contact information.
     */
    @Column(length = 100)
    private String emergencyContactName;

    @Column(length = 100)
    private String emergencyContactRelation;

    @Column(length = 20)
    private String emergencyContactNumber;

    /*
     * Patient's acknowledgement/consent.
     */
    @Column(nullable = false)
    private Boolean consent;

    /*
     * Supporting medical document uploaded by the patient.
     * Example: medical report / doctor recommendation.
     */
    @Column(length = 500)
    private String medicalDocumentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganDonorStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = OrganDonorStatus.PENDING;
        }

        if (consent == null) {
            consent = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}