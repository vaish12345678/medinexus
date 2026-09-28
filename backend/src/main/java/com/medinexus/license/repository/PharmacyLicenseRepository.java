package com.medinexus.license.repository;

import com.medinexus.license.entity.PharmacyLicense;
import com.medinexus.user.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PharmacyLicenseRepository
        extends JpaRepository<PharmacyLicense, Long> {

    List<PharmacyLicense> findByPharmacyId(Long pharmacyId);

    Optional<PharmacyLicense> findByLicenseNumber(String licenseNumber);

    List<PharmacyLicense> findByVerificationStatus(
            VerificationStatus verificationStatus);
}