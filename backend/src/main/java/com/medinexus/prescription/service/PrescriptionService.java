package com.medinexus.prescription.service;

import com.medinexus.appointment.entity.Appointment;
import com.medinexus.appointment.entity.AppointmentStatus;
import com.medinexus.consultation.entity.Consultation;
import com.medinexus.consultation.repository.ConsultationRepository;
import com.medinexus.medicine.entity.Medicine;
import com.medinexus.medicine.repository.MedicineRepository;
import com.medinexus.prescription.dto.PrescriptionItemRequestDto;
import com.medinexus.prescription.dto.PrescriptionItemResponseDto;
import com.medinexus.prescription.dto.PrescriptionRequestDto;
import com.medinexus.prescription.dto.PrescriptionResponseDto;
import com.medinexus.prescription.entity.Prescription;
import com.medinexus.prescription.entity.PrescriptionItem;
import com.medinexus.prescription.repository.PrescriptionItemRepository;
import com.medinexus.prescription.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final ConsultationRepository consultationRepository;
    private final MedicineRepository medicineRepository;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            PrescriptionItemRepository prescriptionItemRepository,
            ConsultationRepository consultationRepository,
            MedicineRepository medicineRepository
    ) {
        this.prescriptionRepository = prescriptionRepository;
        this.prescriptionItemRepository = prescriptionItemRepository;
        this.consultationRepository = consultationRepository;
        this.medicineRepository = medicineRepository;
    }


    // ============================================================
    // CREATE PRESCRIPTION
    // ============================================================

    @Transactional
    public PrescriptionResponseDto createPrescription(
            Long doctorUserId,
            PrescriptionRequestDto dto
    ) {

        Consultation consultation =
                consultationRepository.findById(dto.getConsultationId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Consultation not found"
                                )
                        );

        Appointment appointment =
                consultation.getAppointment();

        if (appointment == null) {
            throw new RuntimeException(
                    "No appointment is associated with this consultation"
            );
        }

        // Make sure this doctor owns the appointment
        if (!appointment.getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to create a prescription for this consultation"
            );
        }

        // Prescription can only be created after consultation
        if (appointment.getStatus()
                != AppointmentStatus.COMPLETED) {

            throw new RuntimeException(
                    "Prescription can only be created after the appointment is completed"
            );
        }

        // Only one prescription per consultation
        if (prescriptionRepository
                .findByConsultationId(dto.getConsultationId())
                .isPresent()) {

            throw new RuntimeException(
                    "Prescription already exists for this consultation"
            );
        }

        Prescription prescription = Prescription.builder()
                .consultation(consultation)
                .notes(dto.getNotes())
                .build();

        Prescription savedPrescription =
                prescriptionRepository.save(prescription);

        return mapToResponseDto(savedPrescription);
    }


    // ============================================================
    // ADD MEDICINE TO PRESCRIPTION
    // ============================================================

    @Transactional
    public PrescriptionItemResponseDto addMedicineToPrescription(
            Long doctorUserId,
            PrescriptionItemRequestDto dto
    ) {

        Prescription prescription =
                prescriptionRepository.findById(
                        dto.getPrescriptionId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Prescription not found"
                        )
                );

        Appointment appointment =
                prescription
                        .getConsultation()
                        .getAppointment();

        if (appointment == null) {
            throw new RuntimeException(
                    "No appointment is associated with this prescription"
            );
        }

        // Make sure this doctor owns the prescription
        if (!appointment.getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to modify this prescription"
            );
        }

        Medicine medicine =
                medicineRepository.findById(dto.getMedicineId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medicine not found"
                                )
                        );

        PrescriptionItem item = PrescriptionItem.builder()
                .prescription(prescription)
                .medicine(medicine)
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .duration(dto.getDuration())
                .quantity(dto.getQuantity())
                .instructions(dto.getInstructions())
                .build();

        PrescriptionItem savedItem =
                prescriptionItemRepository.save(item);

        return mapItemToResponseDto(savedItem);
    }


    // ============================================================
    // GET PRESCRIPTION BY ID
    // ============================================================

    public PrescriptionResponseDto getPrescriptionById(
            Long prescriptionId
    ) {

        Prescription prescription =
                prescriptionRepository.findById(prescriptionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prescription not found"
                                )
                        );

        return mapToResponseDto(prescription);
    }


    // ============================================================
    // GET PRESCRIPTION ITEMS
    // ============================================================

    public List<PrescriptionItemResponseDto> getPrescriptionItems(
            Long prescriptionId
    ) {

        Prescription prescription =
                prescriptionRepository.findById(prescriptionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Prescription not found"
                                )
                        );

        return prescriptionItemRepository
                .findByPrescription(prescription)
                .stream()
                .map(this::mapItemToResponseDto)
                .toList();
    }


    // ============================================================
    // GET PATIENT PRESCRIPTIONS
    // ============================================================

    public List<PrescriptionResponseDto> getPatientPrescriptions(
            Long patientUserId
    ) {

        return prescriptionRepository
                .findByConsultation_Appointment_Patient_Id(
                        patientUserId
                )
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // GET DOCTOR PRESCRIPTIONS
    // ============================================================

    public List<PrescriptionResponseDto> getDoctorPrescriptions(
            Long doctorUserId
    ) {

        return prescriptionRepository
                .findByConsultation_Appointment_Doctor_Id(
                        doctorUserId
                )
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }


    // ============================================================
    // PRESCRIPTION → RESPONSE DTO
    // ============================================================

    private PrescriptionResponseDto mapToResponseDto(
            Prescription prescription
    ) {

        return PrescriptionResponseDto.builder()
                .id(prescription.getId())
                .consultationId(
                        prescription.getConsultation().getId()
                )
                .notes(prescription.getNotes())
                .createdAt(prescription.getCreatedAt())
                .build();
    }


    // ============================================================
    // PRESCRIPTION ITEM → RESPONSE DTO
    // ============================================================

    private PrescriptionItemResponseDto mapItemToResponseDto(
            PrescriptionItem item
    ) {

        return PrescriptionItemResponseDto.builder()
                .id(item.getId())
                .prescriptionId(
                        item.getPrescription().getId()
                )
                .medicineId(
                        item.getMedicine().getId()
                )
                .dosage(item.getDosage())
                .frequency(item.getFrequency())
                .duration(item.getDuration())
                .quantity(item.getQuantity())
                .instructions(item.getInstructions())
                .build();
    }
}