package com.medinexus.license.repository;

import com.medinexus.license.entity.PharmacyLicense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PharmacyLicenseRepository extends JpaRepository<PharmacyLicense, Long> {
}