package com.medinexus.medicine.repository;

import com.medinexus.medicine.entity.MedicineOrder;
import com.medinexus.medicine.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(MedicineOrder order);
}