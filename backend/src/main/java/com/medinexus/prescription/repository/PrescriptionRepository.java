package com.medinexus.prescription.repository;

import com.medinexus.prescription.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    Optional<Prescription> findByConsultationId(Long consultationId);

    List<Prescription> findByConsultation_Appointment_Patient_Id(
            Long patientId
    );

    List<Prescription> findByConsultation_Appointment_Doctor_Id(
            Long doctorId
    );
}