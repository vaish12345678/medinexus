package com.medinexus.hospital.repository;

import com.medinexus.hospital.entity.HospitalDepartment;
import com.medinexus.hospital.entity.HospitalDoctor;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalDoctorRepository
        extends JpaRepository<HospitalDoctor, Long> {

    List<HospitalDoctor> findByHospital(
            HospitalProfile hospital
    );

    List<HospitalDoctor> findByHospitalAndActiveTrue(
            HospitalProfile hospital
    );

    List<HospitalDoctor> findByDepartmentAndActiveTrue(
            HospitalDepartment department
    );

    Optional<HospitalDoctor> findByHospitalAndDoctorAndDepartment(
            HospitalProfile hospital,
            DoctorProfile doctor,
            HospitalDepartment department
    );

    boolean existsByHospitalAndDoctorAndDepartment(
            HospitalProfile hospital,
            DoctorProfile doctor,
            HospitalDepartment department
    );
}