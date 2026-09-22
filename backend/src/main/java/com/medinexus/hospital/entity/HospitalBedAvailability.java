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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private HospitalProfile hospital;

    @Column(name = "bed_type", nullable = false)
    private String bedType;

    @Column(nullable = false)
    private Integer totalBeds;

    @Column(nullable = false)
    private Integer availableBeds;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}