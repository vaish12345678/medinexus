package com.medinexus.hospital.service;

import com.medinexus.hospital.dto.HospitalDepartmentRequestDto;
import com.medinexus.hospital.dto.HospitalDepartmentResponseDto;
import com.medinexus.hospital.entity.HospitalDepartment;
import com.medinexus.hospital.repository.HospitalDepartmentRepository;
import com.medinexus.user.entity.HospitalProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.HospitalProfileRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalDepartmentService {

    private final HospitalDepartmentRepository departmentRepository;
    private final HospitalProfileRepository hospitalProfileRepository;


    // =========================================================
    // CREATE DEPARTMENT
    // =========================================================

    @Transactional
    public HospitalDepartmentResponseDto createDepartment(
            Long hospitalId,
            HospitalDepartmentRequestDto dto
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDepartment department =
                HospitalDepartment.builder()
                        .hospital(hospital)
                        .name(dto.getName().trim())
                        .description(dto.getDescription())
                        .floor(dto.getFloor())
                        .contactNumber(dto.getContactNumber())
                        .active(
                                dto.getActive() == null
                                        || dto.getActive()
                        )
                        .build();

        HospitalDepartment saved =
                departmentRepository.save(department);

        return mapToResponse(saved);
    }


    // =========================================================
    // UPDATE DEPARTMENT
    // =========================================================

    @Transactional
    public HospitalDepartmentResponseDto updateDepartment(
            Long hospitalId,
            Long departmentId,
            HospitalDepartmentRequestDto dto
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDepartment department =
                getDepartment(departmentId);

        validateDepartmentBelongsToHospital(
                department,
                hospitalId
        );

        department.setName(dto.getName().trim());
        department.setDescription(dto.getDescription());
        department.setFloor(dto.getFloor());
        department.setContactNumber(dto.getContactNumber());

        if (dto.getActive() != null) {
            department.setActive(dto.getActive());
        }

        HospitalDepartment updated =
                departmentRepository.save(department);

        return mapToResponse(updated);
    }


    // =========================================================
    // GET ALL DEPARTMENTS OF HOSPITAL
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalDepartmentResponseDto>
    getHospitalDepartments(Long hospitalId) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        return departmentRepository
                .findByHospital(hospital)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET ACTIVE DEPARTMENTS
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalDepartmentResponseDto>
    getActiveHospitalDepartments(Long hospitalId) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        return departmentRepository
                .findByHospitalAndActiveTrue(hospital)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET DEPARTMENT BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public HospitalDepartmentResponseDto
    getDepartmentById(Long departmentId) {

        HospitalDepartment department =
                getDepartment(departmentId);

        return mapToResponse(department);
    }


    // =========================================================
    // DELETE DEPARTMENT
    // =========================================================

    @Transactional
    public void deleteDepartment(
            Long hospitalId,
            Long departmentId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDepartment department =
                getDepartment(departmentId);

        validateDepartmentBelongsToHospital(
                department,
                hospitalId
        );

        departmentRepository.delete(department);
    }


    // =========================================================
    // ACTIVATE DEPARTMENT
    // =========================================================

    @Transactional
    public HospitalDepartmentResponseDto
    activateDepartment(
            Long hospitalId,
            Long departmentId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDepartment department =
                getDepartment(departmentId);

        validateDepartmentBelongsToHospital(
                department,
                hospitalId
        );

        department.setActive(true);

        return mapToResponse(
                departmentRepository.save(department)
        );
    }


    // =========================================================
    // DEACTIVATE DEPARTMENT
    // =========================================================

    @Transactional
    public HospitalDepartmentResponseDto
    deactivateDepartment(
            Long hospitalId,
            Long departmentId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDepartment department =
                getDepartment(departmentId);

        validateDepartmentBelongsToHospital(
                department,
                hospitalId
        );

        department.setActive(false);

        return mapToResponse(
                departmentRepository.save(department)
        );
    }


    // =========================================================
    // VALIDATE HOSPITAL
    // =========================================================

    private void validateHospital(
            HospitalProfile hospital
    ) {

        if (hospital.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Hospital must be verified before managing departments"
            );
        }

        if (!Boolean.TRUE.equals(
                hospital.getActive()
        )) {

            throw new RuntimeException(
                    "Hospital is currently inactive"
            );
        }
    }


    // =========================================================
    // GET HOSPITAL
    // =========================================================

    private HospitalProfile getHospital(
            Long hospitalId
    ) {

        return hospitalProfileRepository
                .findById(hospitalId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hospital not found"
                        )
                );
    }


    // =========================================================
    // GET DEPARTMENT
    // =========================================================

    private HospitalDepartment getDepartment(
            Long departmentId
    ) {

        return departmentRepository
                .findById(departmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );
    }


    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void validateDepartmentBelongsToHospital(
            HospitalDepartment department,
            Long hospitalId
    ) {

        if (!department.getHospital()
                .getId()
                .equals(hospitalId)) {

            throw new RuntimeException(
                    "Department does not belong to this hospital"
            );
        }
    }


    // =========================================================
    // ENTITY → RESPONSE DTO
    // =========================================================

    private HospitalDepartmentResponseDto mapToResponse(
            HospitalDepartment department
    ) {

        return HospitalDepartmentResponseDto
                .builder()
                .id(department.getId())
                .hospitalId(
                        department.getHospital().getId()
                )
                .hospitalName(
                        department.getHospital()
                                .getHospitalName()
                )
                .name(department.getName())
                .description(
                        department.getDescription()
                )
                .floor(department.getFloor())
                .contactNumber(
                        department.getContactNumber()
                )
                .active(department.getActive())
                .build();
    }
}