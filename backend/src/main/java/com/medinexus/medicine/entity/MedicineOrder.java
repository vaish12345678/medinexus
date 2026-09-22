package com.medinexus.medicine.entity;

import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.prescription.entity.Prescription;
import com.medinexus.user.entity.PatientProfile;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "medicine_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacy_id", nullable = false)
    private PharmacyProfile pharmacy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MedicineOrderStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = MedicineOrderStatus.PLACED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}