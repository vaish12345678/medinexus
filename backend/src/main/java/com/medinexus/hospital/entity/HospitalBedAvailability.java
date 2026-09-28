package com.medinexus.hospital.entity;

import com.medinexus.user.entity.HospitalProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "hospital_bed_availability",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_hospital_bed_type",
                        columnNames = {"hospital_id", "bed_type"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalBedAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // HOSPITAL
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private HospitalProfile hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private HospitalDepartment department;



    // =========================
    // BED DETAILS
    // =========================

    @Column(name = "bed_type", nullable = false)
    private String bedType;

    @Column(nullable = false)
    private Integer totalBeds;

    @Column(nullable = false)
    private Integer availableBeds;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;


    // =========================
    // CREATE
    // =========================

    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
    }


    // =========================
    // UPDATE
    // =========================

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}