package com.medinexus.blood.repository;

import com.medinexus.blood.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
}