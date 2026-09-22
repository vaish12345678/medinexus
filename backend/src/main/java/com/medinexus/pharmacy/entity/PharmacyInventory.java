package com.medinexus.pharmacy.entity;

import com.medinexus.medicine.entity.Medicine;
import com.medinexus.user.entity.PharmacyProfile;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "pharmacy_inventory",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_pharmacy_medicine",
                        columnNames = {"pharmacy_id", "medicine_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PharmacyInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "pharmacy_id",
            nullable = false
    )
    private PharmacyProfile pharmacy;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "medicine_id",
            nullable = false
    )
    private Medicine medicine;


    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal price;


    @Column(nullable = false)
    private Integer stockQuantity;


    @Column(nullable = false)
    private Boolean available;
}