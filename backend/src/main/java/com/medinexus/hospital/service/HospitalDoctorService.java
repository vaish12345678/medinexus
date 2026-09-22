package com.medinexus.hospital.service;

import com.medinexus.hospital.dto.HospitalDoctorRequestDto;
import com.medinexus.hospital.dto.HospitalDoctorResponseDto;
import com.medinexus.hospital.entity.HospitalDepartment;
import com.medinexus.hospital.entity.HospitalDoctor;
import com.medinexus.hospital.repository.HospitalDepartmentRepository;
import com.medinexus.hospital.repository.HospitalDoctorRepository;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.HospitalProfile;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.DoctorProfileRepository;
import com.medinexus.user.repository.HospitalProfileRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalDoctorService {

    private final HospitalDoctorRepository hospitalDoctorRepository;
    private final HospitalProfileRepository hospitalProfileRepository;
    private final HospitalDepartmentRepository departmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;


    // =========================================================
    // ADD DOCTOR TO HOSPITAL
    // =========================================================

    @Transactional
    public HospitalDoctorResponseDto addDoctor(
            Long hospitalId,
            HospitalDoctorRequestDto dto
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDepartment department =
                departmentRepository.findById(
                        dto.getDepartmentId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );

        if (!department.getHospital()
                .getId()
                .equals(hospitalId)) {

            throw new RuntimeException(
                    "Department does not belong to this hospital"
            );
        }

        if (!Boolean.TRUE.equals(
                department.getActive()
        )) {

            throw new RuntimeException(
                    "Cannot assign doctor to an inactive department"
            );
        }

        DoctorProfile doctor =
                doctorProfileRepository.findById(
                        dto.getDoctorId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );

        if (hospitalDoctorRepository
                .existsByHospitalAndDoctorAndDepartment(
                        hospital,
                        doctor,
                        department
                )) {

            throw new RuntimeException(
                    "Doctor is already assigned to this department"
            );
        }

        HospitalDoctor hospitalDoctor =
                HospitalDoctor.builder()
                        .hospital(hospital)
                        .doctor(doctor)
                        .department(department)
                        .active(
                                dto.getActive() == null
                                        || dto.getActive()
                        )
                        .build();

        HospitalDoctor saved =
                hospitalDoctorRepository.save(
                        hospitalDoctor
                );

        return mapToResponse(saved);
    }


    // =========================================================
    // GET ALL DOCTORS OF HOSPITAL
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalDoctorResponseDto>
    getHospitalDoctors(Long hospitalId) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        return hospitalDoctorRepository
                .findByHospital(hospital)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET ACTIVE DOCTORS OF HOSPITAL
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalDoctorResponseDto>
    getActiveHospitalDoctors(Long hospitalId) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        return hospitalDoctorRepository
                .findByHospitalAndActiveTrue(hospital)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET DOCTORS BY DEPARTMENT
    // =========================================================

    @Transactional(readOnly = true)
    public List<HospitalDoctorResponseDto>
    getDoctorsByDepartment(
            Long departmentId
    ) {

        HospitalDepartment department =
                departmentRepository.findById(
                        departmentId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );

        return hospitalDoctorRepository
                .findByDepartmentAndActiveTrue(department)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public HospitalDoctorResponseDto
    getHospitalDoctorById(
            Long hospitalDoctorId
    ) {

        HospitalDoctor hospitalDoctor =
                hospitalDoctorRepository
                        .findById(hospitalDoctorId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Hospital doctor record not found"
                                )
                        );

        return mapToResponse(hospitalDoctor);
    }


    // =========================================================
    // REMOVE DOCTOR FROM HOSPITAL
    // =========================================================

    @Transactional
    public void removeDoctor(
            Long hospitalId,
            Long hospitalDoctorId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDoctor hospitalDoctor =
                getHospitalDoctor(hospitalDoctorId);

        validateBelongsToHospital(
                hospitalDoctor,
                hospitalId
        );

        hospitalDoctorRepository.delete(
                hospitalDoctor
        );
    }


    // =========================================================
    // ACTIVATE DOCTOR
    // =========================================================

    @Transactional
    public HospitalDoctorResponseDto activateDoctor(
            Long hospitalId,
            Long hospitalDoctorId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDoctor hospitalDoctor =
                getHospitalDoctor(hospitalDoctorId);

        validateBelongsToHospital(
                hospitalDoctor,
                hospitalId
        );

        hospitalDoctor.setActive(true);

        return mapToResponse(
                hospitalDoctorRepository.save(
                        hospitalDoctor
                )
        );
    }


    // =========================================================
    // DEACTIVATE DOCTOR
    // =========================================================

    @Transactional
    public HospitalDoctorResponseDto deactivateDoctor(
            Long hospitalId,
            Long hospitalDoctorId
    ) {

        HospitalProfile hospital =
                getHospital(hospitalId);

        validateHospital(hospital);

        HospitalDoctor hospitalDoctor =
                getHospitalDoctor(hospitalDoctorId);

        validateBelongsToHospital(
                hospitalDoctor,
                hospitalId
        );

        hospitalDoctor.setActive(false);

        return mapToResponse(
                hospitalDoctorRepository.save(
                        hospitalDoctor
                )
        );
    }


    // =========================================================
    // HOSPITAL VALIDATION
    // =========================================================

    private void validateHospital(
            HospitalProfile hospital
    ) {

        if (hospital.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Hospital must be verified before managing doctors"
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
    // GET HOSPITAL DOCTOR
    // =========================================================

    private HospitalDoctor getHospitalDoctor(
            Long hospitalDoctorId
    ) {

        return hospitalDoctorRepository
                .findById(hospitalDoctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hospital doctor record not found"
                        )
                );
    }


    // =========================================================
    // OWNERSHIP VALIDATION
    // =========================================================

    private void validateBelongsToHospital(
            HospitalDoctor hospitalDoctor,
            Long hospitalId
    ) {

        if (!hospitalDoctor.getHospital()
                .getId()
                .equals(hospitalId)) {

            throw new RuntimeException(
                    "Doctor does not belong to this hospital"
            );
        }
    }


    // =========================================================
    // ENTITY → DTO
    // =========================================================

    private HospitalDoctorResponseDto mapToResponse(
            HospitalDoctor hospitalDoctor
    ) {

        return HospitalDoctorResponseDto.builder()
                .id(hospitalDoctor.getId())

                .hospitalId(
                        hospitalDoctor.getHospital()
                                .getId()
                )

                .hospitalName(
                        hospitalDoctor.getHospital()
                                .getHospitalName()
                )

                .doctorId(
                        hospitalDoctor.getDoctor()
                                .getId()
                )

                .doctorName(
                        hospitalDoctor.getDoctor()
                                .getUser()
                                .getName()
                )

                .departmentId(
                        hospitalDoctor.getDepartment()
                                .getId()
                )

                .departmentName(
                        hospitalDoctor.getDepartment()
                                .getName()
                )

                .active(
                        hospitalDoctor.getActive()
                )

                .build();
    }
}