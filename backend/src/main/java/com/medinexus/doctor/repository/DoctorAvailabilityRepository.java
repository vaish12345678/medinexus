package com.medinexus.doctor.repository;

import com.medinexus.doctor.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface DoctorAvailabilityRepository
        extends JpaRepository<DoctorAvailability, Long> {

    List<DoctorAvailability> findByDoctorId(Long doctorId);

    List<DoctorAvailability> findByDoctorIdAndDayOfWeek(
            Long doctorId,
            DayOfWeek dayOfWeek
    );
}