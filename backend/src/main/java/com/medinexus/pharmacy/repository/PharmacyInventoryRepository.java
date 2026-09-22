package com.medinexus.pharmacy.repository;

import com.medinexus.medicine.entity.Medicine;
import com.medinexus.pharmacy.entity.PharmacyInventory;
import com.medinexus.user.entity.PharmacyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PharmacyInventoryRepository extends JpaRepository<PharmacyInventory, Long> {


    // Get all inventory belonging to a pharmacy
    List<PharmacyInventory> findByPharmacy(
            PharmacyProfile pharmacy
    );

    // Get all available medicines from a pharmacy
    List<PharmacyInventory> findByPharmacyAndAvailableTrue(
            PharmacyProfile pharmacy
    );

    // Find a particular medicine in a particular pharmacy
    Optional<PharmacyInventory> findByPharmacyAndMedicine(
            PharmacyProfile pharmacy,
            Medicine medicine
    );

    // Check whether pharmacy already has this medicine
    boolean existsByPharmacyAndMedicine(
            PharmacyProfile pharmacy,
            Medicine medicine
    );

    // Find all pharmacies that have a particular medicine available
    List<PharmacyInventory> findByMedicineAndAvailableTrue(
            Medicine medicine
    );
}