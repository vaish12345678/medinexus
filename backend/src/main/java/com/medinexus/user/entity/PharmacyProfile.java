package com.medinexus.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pharmacy_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyProfile {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String pharmacyName;

    @Column(nullable = false)
    private String address;

    private String licenseUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;
}