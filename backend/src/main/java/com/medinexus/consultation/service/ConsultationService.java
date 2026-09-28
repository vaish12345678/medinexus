package com.medinexus.consultation.service;

import com.medinexus.appointment.entity.Appointment;
import com.medinexus.appointment.entity.AppointmentStatus;
import com.medinexus.appointment.repository.AppointmentRepository;
import com.medinexus.consultation.dto.ConsultationRequestDto;
import com.medinexus.consultation.dto.ConsultationResponseDto;
import com.medinexus.consultation.entity.Consultation;
import com.medinexus.consultation.repository.ConsultationRepository;
import com.medinexus.prescription.entity.Prescription;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.PatientProfile;
import com.medinexus.user.entity.Role;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.medinexus.notification.entity.NotificationType;
import com.medinexus.notification.service.NotificationService;
import com.medinexus.prescription.repository.PrescriptionRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final PrescriptionRepository prescriptionRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            AppointmentRepository appointmentRepository, NotificationService notificationService, PrescriptionRepository prescriptionRepository
    ) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
        this.prescriptionRepository = prescriptionRepository;
    }


    // =========================================================
    // DOCTOR CREATES CONSULTATION
    // =========================================================

    public ConsultationResponseDto createConsultation(
            Long doctorUserId,
            ConsultationRequestDto dto
    ) {

        // -----------------------------------------------------
        // 1. Find appointment
        // -----------------------------------------------------

        Appointment appointment =
                appointmentRepository.findById(dto.getAppointmentId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );


        // -----------------------------------------------------
        // 2. Check doctor owns appointment
        // -----------------------------------------------------

        if (!appointment.getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to create consultation for this appointment"
            );
        }


        // -----------------------------------------------------
        // 3. Appointment must be confirmed
        // -----------------------------------------------------

        if (appointment.getStatus()
                != AppointmentStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Consultation can only be created for a confirmed appointment"
            );
        }


        // -----------------------------------------------------
        // 4. Prevent duplicate consultation
        // -----------------------------------------------------

        if (consultationRepository
                .existsByAppointmentId(dto.getAppointmentId())) {

            throw new RuntimeException(
                    "Consultation already exists for this appointment"
            );
        }


        // -----------------------------------------------------
        // 5. Create consultation
        // -----------------------------------------------------

        Consultation consultation = new Consultation();

        consultation.setAppointment(appointment);
        consultation.setNotes(dto.getNotes());
        consultation.setDiagnosisNotes(dto.getDiagnosisNotes());


        // -----------------------------------------------------
        // 6. Save consultation
        // -----------------------------------------------------

        Consultation savedConsultation =
                consultationRepository.save(consultation);
        // Notify patient
        notificationService.createNotification(
                appointment.getPatient().getId(),
                "Consultation Added",
                "Dr. "
                        + appointment.getDoctor().getUser().getName()
                        + " has added your consultation notes and diagnosis.",
                NotificationType.CONSULTATION
        );


        // -----------------------------------------------------
        // 7. Mark appointment as completed
        // -----------------------------------------------------

        appointment.setStatus(
                AppointmentStatus.COMPLETED
        );

        appointmentRepository.save(appointment);


        // -----------------------------------------------------
        // 8. Return response
        // -----------------------------------------------------

        return mapToResponseDto(savedConsultation);
    }


    // =========================================================
    // GET CONSULTATION BY ID
    //
    // Patient -> only own consultation
    // Doctor  -> only own consultation
    // Admin   -> any consultation
    // =========================================================

    @Transactional(readOnly = true)
    public ConsultationResponseDto getConsultationById(
            Long consultationId,
            Long userId,
            Role role
    ) {

        Consultation consultation =
                consultationRepository.findById(consultationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Consultation not found"
                                )
                        );


        // -----------------------------------------------------
        // Check patient ownership
        // -----------------------------------------------------

        boolean isPatientOwner =
                role == Role.PATIENT &&
                        consultation.getAppointment()
                                .getPatient()
                                .getId()
                                .equals(userId);


        // -----------------------------------------------------
        // Check doctor ownership
        // -----------------------------------------------------

        boolean isDoctorOwner =
                role == Role.DOCTOR &&
                        consultation.getAppointment()
                                .getDoctor()
                                .getId()
                                .equals(userId);


        // -----------------------------------------------------
        // Admin can view any consultation
        // -----------------------------------------------------

        boolean isAdmin =
                role == Role.ADMIN;


        // -----------------------------------------------------
        // Reject unauthorized access
        // -----------------------------------------------------

        if (!isPatientOwner &&
                !isDoctorOwner &&
                !isAdmin) {

            throw new RuntimeException(
                    "You are not allowed to view this consultation"
            );
        }


        return mapToResponseDto(consultation);
    }


    // =========================================================
    // PATIENT GETS OWN CONSULTATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<ConsultationResponseDto> getPatientConsultations(
            Long patientUserId
    ) {

        PatientProfile patient = new PatientProfile();

        patient.setId(patientUserId);


        List<Consultation> consultations =
                consultationRepository
                        .findByAppointment_Patient(patient);


        return consultations.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // =========================================================
    // DOCTOR GETS OWN CONSULTATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<ConsultationResponseDto> getDoctorConsultations(
            Long doctorUserId
    ) {

        DoctorProfile doctor = new DoctorProfile();

        doctor.setId(doctorUserId);


        List<Consultation> consultations =
                consultationRepository
                        .findByAppointment_Doctor(doctor);


        return consultations.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }


    // =========================================================
    // DOCTOR UPDATES CONSULTATION
    // =========================================================

    public ConsultationResponseDto updateConsultation(
            Long consultationId,
            Long doctorUserId,
            ConsultationRequestDto dto
    ) {

        Consultation consultation =
                consultationRepository.findById(consultationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Consultation not found"
                                )
                        );


        // -----------------------------------------------------
        // Check doctor ownership
        // -----------------------------------------------------

        if (!consultation.getAppointment()
                .getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to update this consultation"
            );
        }


        // -----------------------------------------------------
        // Update fields
        // -----------------------------------------------------

        consultation.setNotes(
                dto.getNotes()
        );

        consultation.setDiagnosisNotes(
                dto.getDiagnosisNotes()
        );


        Consultation updatedConsultation =
                consultationRepository.save(consultation);


        return mapToResponseDto(updatedConsultation);
    }


    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================
    private ConsultationResponseDto mapToResponseDto(
            Consultation consultation
    ) {

        Long prescriptionId = prescriptionRepository
                .findByConsultationId(consultation.getId())
                .map(Prescription::getId)
                .orElse(null);

        String patientName = null;

        if (consultation.getAppointment() != null &&
                consultation.getAppointment().getPatient() != null &&
                consultation.getAppointment().getPatient().getUser() != null) {

            patientName =
                    consultation
                            .getAppointment()
                            .getPatient()
                            .getUser()
                            .getName();
        }

        return ConsultationResponseDto.builder()
                .id(consultation.getId())
                .appointmentId(
                        consultation.getAppointment().getId()
                )
                .patientName(patientName)
                .prescriptionId(prescriptionId)
                .notes(consultation.getNotes())
                .diagnosisNotes(consultation.getDiagnosisNotes())
                .createdAt(consultation.getCreatedAt())
                .build();
    }
}