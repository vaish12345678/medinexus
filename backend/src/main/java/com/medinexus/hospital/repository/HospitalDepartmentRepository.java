package com.medinexus.hospital.repository;

import com.medinexus.hospital.entity.HospitalDepartment;
import com.medinexus.user.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalDepartmentRepository
        extends JpaRepository<HospitalDepartment, Long> {

    List<HospitalDepartment> findByHospital(
            HospitalProfile hospital
    );

    List<HospitalDepartment> findByHospitalAndActiveTrue(
            HospitalProfile hospital
    );
}