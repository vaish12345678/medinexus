package com.medinexus.pharmacy.service;

import com.medinexus.medicine.entity.Medicine;
import com.medinexus.medicine.repository.MedicineRepository;
import com.medinexus.pharmacy.dto.PharmacyInventoryRequestDto;
import com.medinexus.pharmacy.dto.PharmacyInventoryResponseDto;
import com.medinexus.pharmacy.entity.PharmacyInventory;
import com.medinexus.pharmacy.repository.PharmacyInventoryRepository;
import com.medinexus.user.entity.PharmacyProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.PharmacyProfileRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PharmacyInventoryService {

    private final PharmacyInventoryRepository inventoryRepository;
    private final PharmacyProfileRepository pharmacyProfileRepository;
    private final MedicineRepository medicineRepository;


    // ============================================================
    // ADD MEDICINE TO PHARMACY INVENTORY
    // ============================================================

    @Transactional
    public PharmacyInventoryResponseDto addInventory(
            Long pharmacyId,
            PharmacyInventoryRequestDto dto
    ) {

        // 1. Find pharmacy
        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy not found"
                                )
                        );


        // 2. Pharmacy must be verified
        if (pharmacy.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Only verified pharmacies can manage inventory"
            );
        }


        // 3. Find medicine
        Medicine medicine =
                medicineRepository.findById(dto.getMedicineId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );


        // 4. Prevent duplicate medicine
        if (inventoryRepository.existsByPharmacyAndMedicine(
                pharmacy,
                medicine
        )) {

            throw new RuntimeException(
                    "This medicine already exists in pharmacy inventory"
            );
        }


        // 5. Create inventory
        PharmacyInventory inventory =
                new PharmacyInventory();

        inventory.setPharmacy(pharmacy);
        inventory.setMedicine(medicine);
        inventory.setPrice(dto.getPrice());
        inventory.setStockQuantity(dto.getStockQuantity());


        // Automatically determine availability
        inventory.setAvailable(
                dto.getStockQuantity() > 0
        );


        // 6. Save
        PharmacyInventory saved =
                inventoryRepository.save(inventory);


        return mapToResponseDto(saved);
    }


    // ============================================================
    // GET PHARMACY INVENTORY
    // ============================================================

    @Transactional(readOnly = true)
    public List<PharmacyInventoryResponseDto> getPharmacyInventory(
            Long pharmacyId
    ) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy not found"
                                )
                        );

        return inventoryRepository
                .findByPharmacy(pharmacy)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // GET AVAILABLE MEDICINES OF PHARMACY
    // ============================================================

    @Transactional(readOnly = true)
    public List<PharmacyInventoryResponseDto>
    getAvailableInventory(Long pharmacyId) {

        PharmacyProfile pharmacy =
                pharmacyProfileRepository.findById(pharmacyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Pharmacy not found"
                                )
                        );

        return inventoryRepository
                .findByPharmacyAndAvailableTrue(pharmacy)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // GET INVENTORY BY ID
    // ============================================================

    @Transactional(readOnly = true)
    public PharmacyInventoryResponseDto getInventoryById(
            Long inventoryId
    ) {

        PharmacyInventory inventory =
                inventoryRepository.findById(inventoryId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory item not found"
                                )
                        );

        return mapToResponseDto(inventory);
    }


    // ============================================================
    // UPDATE INVENTORY
    // ============================================================

    @Transactional
    public PharmacyInventoryResponseDto updateInventory(
            Long pharmacyId,
            Long inventoryId,
            PharmacyInventoryRequestDto dto
    ) {

        PharmacyInventory inventory =
                inventoryRepository.findById(inventoryId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory item not found"
                                )
                        );


        // Make sure this inventory belongs to this pharmacy
        if (!inventory.getPharmacy()
                .getId()
                .equals(pharmacyId)) {

            throw new RuntimeException(
                    "You cannot modify another pharmacy's inventory"
            );
        }


        // Pharmacy must still be verified
        if (inventory.getPharmacy()
                .getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Only verified pharmacies can manage inventory"
            );
        }


        // Find medicine
        Medicine medicine =
                medicineRepository.findById(dto.getMedicineId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );


        // If medicine is changed, make sure the new
        // medicine doesn't already exist in this pharmacy
        if (!inventory.getMedicine()
                .getId()
                .equals(medicine.getId())) {

            if (inventoryRepository
                    .existsByPharmacyAndMedicine(
                            inventory.getPharmacy(),
                            medicine
                    )) {

                throw new RuntimeException(
                        "This medicine already exists in pharmacy inventory"
                );
            }
        }


        inventory.setMedicine(medicine);
        inventory.setPrice(dto.getPrice());
        inventory.setStockQuantity(dto.getStockQuantity());


        // Automatically update availability
        inventory.setAvailable(
                dto.getStockQuantity() > 0
        );


        PharmacyInventory updated =
                inventoryRepository.save(inventory);


        return mapToResponseDto(updated);
    }


    // ============================================================
    // DELETE INVENTORY
    // ============================================================

    @Transactional
    public void deleteInventory(
            Long pharmacyId,
            Long inventoryId
    ) {

        PharmacyInventory inventory =
                inventoryRepository.findById(inventoryId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory item not found"
                                )
                        );


        // Ownership check
        if (!inventory.getPharmacy()
                .getId()
                .equals(pharmacyId)) {

            throw new RuntimeException(
                    "You cannot delete another pharmacy's inventory"
            );
        }


        // Verification check
        if (inventory.getPharmacy()
                .getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Only verified pharmacies can manage inventory"
            );
        }


        inventoryRepository.delete(inventory);
    }


    // ============================================================
    // FIND MEDICINE ACROSS VERIFIED PHARMACIES
    // ============================================================

    @Transactional(readOnly = true)
    public List<PharmacyInventoryResponseDto>
    findMedicineInPharmacies(Long medicineId) {

        Medicine medicine =
                medicineRepository.findById(medicineId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );

        return inventoryRepository
                .findByMedicineAndAvailableTrue(medicine)
                .stream()

                // Only verified pharmacies
                .filter(inventory ->
                        inventory.getPharmacy()
                                .getVerificationStatus()
                                == VerificationStatus.VERIFIED
                )

                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // ENTITY → DTO
    // ============================================================

    private PharmacyInventoryResponseDto mapToResponseDto(
            PharmacyInventory inventory
    ) {

        return PharmacyInventoryResponseDto.builder()
                .id(inventory.getId())
                .pharmacyId(
                        inventory.getPharmacy().getId()
                )
                .medicineId(
                        inventory.getMedicine().getId()
                )
                .price(
                        inventory.getPrice()
                )
                .stockQuantity(
                        inventory.getStockQuantity()
                )
                .available(
                        inventory.getAvailable()
                )
                .build();
    }
}