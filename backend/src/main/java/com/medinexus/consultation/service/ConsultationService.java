package com.medinexus.consultation.service;

import com.medinexus.appointment.entity.Appointment;
import com.medinexus.appointment.entity.AppointmentStatus;
import com.medinexus.appointment.repository.AppointmentRepository;
import com.medinexus.consultation.dto.ConsultationRequestDto;
import com.medinexus.consultation.dto.ConsultationResponseDto;
import com.medinexus.consultation.entity.Consultation;
import com.medinexus.consultation.repository.ConsultationRepository;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.PatientProfile;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            AppointmentRepository appointmentRepository
    ) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // Doctor creates consultation
    public ConsultationResponseDto createConsultation(
            Long doctorUserId,
            ConsultationRequestDto dto
    ) {

        // 1. Find appointment
        Appointment appointment =
                appointmentRepository.findById(dto.getAppointmentId())
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found")
                        );

        // 2. Check doctor owns this appointment
        if (!appointment.getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to create consultation for this appointment"
            );
        }

        // 3. Appointment must be confirmed
        if (appointment.getStatus()
                != AppointmentStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Consultation can only be created for a confirmed appointment"
            );
        }

        // 4. Prevent duplicate consultation
        if (consultationRepository
                .existsByAppointmentId(dto.getAppointmentId())) {

            throw new RuntimeException(
                    "Consultation already exists for this appointment"
            );
        }

        // 5. Create consultation
        Consultation consultation = new Consultation();

        consultation.setAppointment(appointment);
        consultation.setNotes(dto.getNotes());
        consultation.setDiagnosisNotes(dto.getDiagnosisNotes());

        // 6. Save consultation
        Consultation savedConsultation =
                consultationRepository.save(consultation);

        // 7. Mark appointment as completed
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        // 8. Return response
        return mapToResponseDto(savedConsultation);
    }


    // Get consultation by ID
    public ConsultationResponseDto getConsultationById(
            Long consultationId
    ) {

        Consultation consultation =
                consultationRepository.findById(consultationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Consultation not found"
                                )
                        );

        return mapToResponseDto(consultation);
    }


    // Patient gets own consultations
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


    // Doctor gets own consultations
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


    // Doctor updates consultation
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

        // Check doctor ownership
        if (!consultation.getAppointment()
                .getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to update this consultation"
            );
        }

        // Update fields
        consultation.setNotes(dto.getNotes());
        consultation.setDiagnosisNotes(dto.getDiagnosisNotes());

        Consultation updatedConsultation =
                consultationRepository.save(consultation);

        return mapToResponseDto(updatedConsultation);
    }


    // Convert Entity → Response DTO
    private ConsultationResponseDto mapToResponseDto(
            Consultation consultation
    ) {

        return ConsultationResponseDto.builder()
                .id(consultation.getId())
                .appointmentId(
                        consultation.getAppointment().getId()
                )
                .notes(consultation.getNotes())
                .diagnosisNotes(
                        consultation.getDiagnosisNotes()
                )
                .createdAt(consultation.getCreatedAt())
                .build();
    }
}