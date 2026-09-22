package com.medinexus.medicine.repository;

import com.medinexus.medicine.entity.MedicineOrder;
import com.medinexus.medicine.entity.MedicineOrderStatus;
import com.medinexus.user.entity.PatientProfile;
import com.medinexus.user.entity.PharmacyProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineOrderRepository extends JpaRepository<MedicineOrder, Long> {


    List<MedicineOrder> findByPatient(PatientProfile patient);

    List<MedicineOrder> findByPharmacy(PharmacyProfile pharmacy);

    List<MedicineOrder> findByStatus(MedicineOrderStatus status);

}