package com.medinexus.user.entity;

import jakarta.persistence.*;

public class AmbulanceProfile {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String vehicleNumber;

    @Column(nullable = false)
    private String driverContact;

    private Boolean isAvailable;

    private String licenseUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus verificationStatus;
}
