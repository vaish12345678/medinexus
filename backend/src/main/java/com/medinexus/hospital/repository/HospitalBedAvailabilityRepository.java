package com.medinexus.hospital.repository;

import com.medinexus.hospital.entity.HospitalBedAvailability;
import com.medinexus.user.entity.HospitalProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalBedAvailabilityRepository
        extends JpaRepository<HospitalBedAvailability, Long> {

    // Get all bed availability records for a hospital
    List<HospitalBedAvailability> findByHospital(
            HospitalProfile hospital
    );

    // Find a specific bed type in a hospital
    Optional<HospitalBedAvailability> findByHospitalAndBedType(
            HospitalProfile hospital,
            String bedType
    );

    // Find bed types having more than the given number
    // of available beds
    List<HospitalBedAvailability>
    findByHospitalAndAvailableBedsGreaterThan(
            HospitalProfile hospital,
            Integer availableBeds
    );
}