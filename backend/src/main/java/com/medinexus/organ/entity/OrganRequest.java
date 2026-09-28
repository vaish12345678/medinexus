package com.medinexus.organ.entity;

import com.medinexus.user.entity.PatientProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "organ_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    // =========================================================
    // ORGAN REQUIREMENT
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganType organType;

    @Column(length = 20, nullable = false)
    private String bloodGroup;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganRequestUrgency urgency;

    // =========================================================
    // MEDICAL INFORMATION
    // =========================================================

    @Column(length = 2000)
    private String diagnosis;

    @Column(length = 2000)
    private String transplantReason;

    @Column(length = 2000)
    private String currentTreatment;

    // =========================================================
    // DOCTOR / HOSPITAL INFORMATION
    // =========================================================

    @Column(length = 150)
    private String doctorName;

    @Column(length = 200)
    private String hospitalName;

    @Column(length = 100)
    private String hospitalCity;

    @Column(length = 30)
    private String doctorContact;

    // =========================================================
    // SUPPORTING INFORMATION
    // =========================================================

    @Column(length = 500)
    private String medicalDocumentUrl;

    @Column(length = 2000)
    private String additionalNotes;

    // =========================================================
    // REQUEST STATUS
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganRequestStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // LIFECYCLE
    // =========================================================

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = OrganRequestStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}