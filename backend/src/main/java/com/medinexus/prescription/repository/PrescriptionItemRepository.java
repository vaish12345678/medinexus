package com.medinexus.prescription.repository;

import com.medinexus.prescription.entity.Prescription;
import com.medinexus.prescription.entity.PrescriptionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionItemRepository extends JpaRepository<PrescriptionItem, Long> {
    List<PrescriptionItem> findByPrescription(Prescription prescription);
}