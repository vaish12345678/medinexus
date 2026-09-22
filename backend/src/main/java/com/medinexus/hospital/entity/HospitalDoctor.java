package com.medinexus.hospital.entity;

import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.HospitalProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "hospital_doctors",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_hospital_doctor_department",
                        columnNames = {
                                "hospital_id",
                                "doctor_id",
                                "department_id"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDoctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private HospitalProfile hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private DoctorProfile doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private HospitalDepartment department;

    @Column(nullable = false)
    private Boolean active;

    @PrePersist
    protected void onCreate() {

        if (active == null) {
            active = true;
        }
    }
}