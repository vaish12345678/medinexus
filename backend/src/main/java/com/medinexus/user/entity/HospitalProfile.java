package com.medinexus.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hospital_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hospitalName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    private String city;

    @Column(nullable = false)
    private String contactNumber;

    private String email;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private Boolean emergencyAvailable;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @Column(nullable = false)
    private Boolean active;

    @PrePersist
    protected void onCreate() {

        if (emergencyAvailable == null) {
            emergencyAvailable = false;
        }

        if (active == null) {
            active = true;
        }

        if (verificationStatus == null) {
            verificationStatus = VerificationStatus.PENDING;
        }
    }
}