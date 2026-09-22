package com.medinexus.consultation.repository;

import com.medinexus.consultation.entity.Consultation;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    Optional<Consultation> findByAppointmentId(Long appointmentId);

    List<Consultation> findByAppointment_Patient(PatientProfile patient);

    List<Consultation> findByAppointment_Doctor(DoctorProfile doctor);

    boolean existsByAppointmentId(Long appointmentId);

}