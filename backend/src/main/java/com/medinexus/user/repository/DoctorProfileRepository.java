package com.medinexus.user.repository;

import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {

    List<DoctorProfile> findBySpecializationIgnoreCaseAndVerificationStatus(
            String specialization,
            VerificationStatus verificationStatus
    );

    boolean existsByLicenseUrl(String licenseUrl);
}