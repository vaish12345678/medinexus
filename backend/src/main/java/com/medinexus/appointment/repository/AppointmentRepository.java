package com.medinexus.appointment.repository;

import com.medinexus.appointment.entity.Appointment;
import com.medinexus.appointment.entity.AppointmentStatus;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(PatientProfile patient);
    List<Appointment> findByDoctor(DoctorProfile doctor);
    boolean existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot
            (
                    DoctorProfile doctor, LocalDate appointmentDate,
                    LocalTime appointmentTime, AppointmentStatus status
            );
}