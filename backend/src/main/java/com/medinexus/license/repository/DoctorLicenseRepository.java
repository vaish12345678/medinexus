package com.medinexus.license.repository;

import com.medinexus.license.entity.DoctorLicense;
import com.medinexus.user.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorLicenseRepository
        extends JpaRepository<DoctorLicense, Long> {

    List<DoctorLicense> findByDoctorId(Long doctorId);

    Optional<DoctorLicense> findByLicenseNumber(
            String licenseNumber);

    boolean existsByLicenseNumber(
            String licenseNumber);

    List<DoctorLicense> findByVerificationStatus(
            VerificationStatus verificationStatus);
}