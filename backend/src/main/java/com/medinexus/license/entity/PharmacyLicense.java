package com.medinexus.license.entity;


import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.user.entity.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pharmacy_licenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyLicense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private PharmacyProfile pharmacy;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Column(nullable = false)
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    private LocalDateTime verifiedAt;

    private String rejectionReason;
    @PrePersist protected void onCreate() { submittedAt = LocalDateTime.now(); }
}
