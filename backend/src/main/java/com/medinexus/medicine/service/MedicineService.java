package com.medinexus.medicine.service;

import com.medinexus.medicine.dto.MedicineRequestDto;
import com.medinexus.medicine.dto.MedicineResponseDto;
import com.medinexus.medicine.entity.Medicine;
import com.medinexus.medicine.repository.MedicineRepository;
import org.springframework.stereotype.Service;
import com.medinexus.user.entity.Role;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(
            MedicineRepository medicineRepository
    ) {
        this.medicineRepository = medicineRepository;
    }

    // Create medicine
    public MedicineResponseDto createMedicine(
            MedicineRequestDto dto,
             Role role
    ) {
        if (role != Role.ADMIN) {
            throw new RuntimeException("Only admin can create medicines");
        }


        // Check duplicate medicine
        if (medicineRepository.existsByNameIgnoreCase(dto.getName())) {

            throw new RuntimeException(
                    "Medicine with this name already exists"
            );
        }

        Medicine medicine = new Medicine();

        medicine.setName(dto.getName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setDescription(dto.getDescription());

        Medicine savedMedicine =
                medicineRepository.save(medicine);

        return mapToResponseDto(savedMedicine);
    }


    // Get all medicines
    public List<MedicineResponseDto> getAllMedicines() {

        return medicineRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // Get medicine by ID
    public MedicineResponseDto getMedicineById(
            Long medicineId
    ) {

        Medicine medicine =
                medicineRepository.findById(medicineId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );

        return mapToResponseDto(medicine);
    }


    // Update medicine
    public MedicineResponseDto updateMedicine(
            Long medicineId,
            MedicineRequestDto dto,        Role role


    ) {
        if (role != Role.ADMIN) {
            throw new RuntimeException("Only admin can update medicines");
        }

        Medicine medicine =
                medicineRepository.findById(medicineId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );

        medicine.setName(dto.getName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setDescription(dto.getDescription());

        Medicine updatedMedicine =
                medicineRepository.save(medicine);

        return mapToResponseDto(updatedMedicine);
    }


    // Delete medicine
    public void deleteMedicine(
            Long medicineId,
            Role role
    ) {
        if (role != Role.ADMIN) {
            throw new RuntimeException("Only admin can delete medicines");
        }

        Medicine medicine =
                medicineRepository.findById(medicineId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );

        medicineRepository.delete(medicine);
    }


    // Entity → DTO
    private MedicineResponseDto mapToResponseDto(
            Medicine medicine
    ) {

        return MedicineResponseDto.builder()
                .id(medicine.getId())
                .name(medicine.getName())
                .genericName(medicine.getGenericName())
                .manufacturer(medicine.getManufacturer())
                .description(medicine.getDescription())
                .build();
    }
}