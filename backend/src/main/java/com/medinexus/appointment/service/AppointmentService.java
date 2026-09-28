package com.medinexus.appointment.service;

import com.medinexus.appointment.dto.AppointmentRequestDto;
import com.medinexus.appointment.dto.AppointmentResponseDto;
import com.medinexus.appointment.entity.Appointment;
import com.medinexus.appointment.entity.AppointmentStatus;
import com.medinexus.appointment.repository.AppointmentRepository;
import com.medinexus.doctor.entity.DoctorAvailability;
import com.medinexus.doctor.repository.DoctorAvailabilityRepository;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.entity.PatientProfile;
import com.medinexus.user.entity.Role;
import com.medinexus.user.entity.User;
import com.medinexus.user.entity.VerificationStatus;
import com.medinexus.user.repository.DoctorProfileRepository;
import com.medinexus.user.repository.PatientProfileRepository;
import com.medinexus.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import com.medinexus.notification.entity.NotificationType;
import com.medinexus.notification.service.NotificationService;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;
    private final DoctorAvailabilityRepository doctorAvailabilityRepository;
    private final NotificationService notificationService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientProfileRepository patientProfileRepository,
            DoctorProfileRepository doctorProfileRepository,
            UserRepository userRepository,
            DoctorAvailabilityRepository doctorAvailabilityRepository, NotificationService notificationService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
        this.doctorAvailabilityRepository = doctorAvailabilityRepository;
        this.notificationService = notificationService;
    }

    // ============================================================
    // CREATE APPOINTMENT - PATIENT
    // ============================================================

    @Transactional
    public AppointmentResponseDto createAppointment(
            Long patientUserId,
            AppointmentRequestDto dto
    ) {

        // 1. Find logged-in user
        User user = userRepository.findById(patientUserId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // 2. Check that logged-in user is actually a PATIENT
        if (user.getRole() != Role.PATIENT) {
            throw new RuntimeException(
                    "Only patients can book appointments"
            );
        }

        // 3. Find patient's profile
        PatientProfile patient = patientProfileRepository
                .findById(patientUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient profile not found. Please create your profile first."
                        )
                );

        // 4. Find doctor
        DoctorProfile doctor = doctorProfileRepository
                .findById(dto.getDoctorId())
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        // 5. Check whether doctor is verified
        if (doctor.getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "You can only book an appointment with a verified doctor"
            );
        }

        // 6. Check date + time is not in the past
        LocalDateTime appointmentDateTime =
                LocalDateTime.of(
                        dto.getAppointmentDate(),
                        dto.getAppointmentTime()
                );

        if (appointmentDateTime.isBefore(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Appointment date and time cannot be in the past"
            );
        }

        // 7. Check doctor's availability
        DayOfWeek dayOfWeek =
                dto.getAppointmentDate().getDayOfWeek();

        List<DoctorAvailability> availabilities =
                doctorAvailabilityRepository
                        .findByDoctorIdAndDayOfWeek(
                                doctor.getId(),
                                dayOfWeek
                        );

        if (availabilities.isEmpty()) {
            throw new RuntimeException(
                    "Doctor is not available on " + dayOfWeek
            );
        }

        boolean withinAvailability =
                availabilities.stream()
                        .anyMatch(slot ->
                                Boolean.TRUE.equals(slot.getActive())
                                        &&
                                        !dto.getAppointmentTime()
                                                .isBefore(slot.getStartTime())
                                        &&
                                        dto.getAppointmentTime()
                                                .isBefore(slot.getEndTime())
                        );

        if (!withinAvailability) {
            throw new RuntimeException(
                    "Doctor is not available at the selected date and time"
            );
        }

        // 8. Check whether doctor already has an appointment
        boolean alreadyBooked =
                appointmentRepository
                        .existsByDoctorAndAppointmentDateAndAppointmentTimeAndStatusNot(
                                doctor,
                                dto.getAppointmentDate(),
                                dto.getAppointmentTime(),
                                AppointmentStatus.CANCELLED
                        );

        if (alreadyBooked) {
            throw new RuntimeException(
                    "Doctor is already booked for this date and time"
            );
        }

        // 9. Create appointment
        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(
                dto.getAppointmentDate()
        );
        appointment.setAppointmentTime(
                dto.getAppointmentTime()
        );
        appointment.setReason(dto.getReason());
        appointment.setStatus(
                AppointmentStatus.REQUESTED
        );

        // 10. Save appointment
        Appointment savedAppointment =
                appointmentRepository.save(appointment);

        notificationService.createNotification(
                appointment.getDoctor().getId(),
                "New Appointment Request",
                "Patient "
                        + appointment.getPatient().getUser().getName()
                        + " has requested an appointment on "
                        + appointment.getAppointmentDate()
                        + " at "
                        + appointment.getAppointmentTime()
                        + ".",
                NotificationType.APPOINTMENT
        );


        // 11. Convert entity to response DTO
        return mapToResponseDto(savedAppointment);
    }

    // ============================================================
    // GET PATIENT APPOINTMENTS
    // ============================================================

    public List<AppointmentResponseDto> getPatientAppointments(
            Long patientUserId
    ) {

        PatientProfile patient =
                patientProfileRepository
                        .findById(patientUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient profile not found"
                                )
                        );

        List<Appointment> appointments =
                appointmentRepository.findByPatient(patient);

        return appointments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET DOCTOR APPOINTMENTS
    // ============================================================

    public List<AppointmentResponseDto> getDoctorAppointments(
            Long doctorUserId
    ) {

        DoctorProfile doctor =
                doctorProfileRepository
                        .findById(doctorUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor profile not found"
                                )
                        );

        List<Appointment> appointments =
                appointmentRepository.findByDoctor(doctor);

        return appointments.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    // ============================================================
    // GET APPOINTMENT BY ID
    // ============================================================
    @Transactional(readOnly = true)
    public AppointmentResponseDto getAppointmentById(
            Long appointmentId,
            Long userId,
            Role role
    ) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found")
                );

        boolean isPatientOwner =
                role == Role.PATIENT &&
                        appointment.getPatient()
                                .getId()
                                .equals(userId);

        boolean isDoctorOwner =
                role == Role.DOCTOR &&
                        appointment.getDoctor()
                                .getId()
                                .equals(userId);

        boolean isAdmin =
                role == Role.ADMIN;

        if (!isPatientOwner && !isDoctorOwner && !isAdmin) {
            throw new RuntimeException(
                    "You are not allowed to view this appointment"
            );
        }

        return mapToResponseDto(appointment);
    }

    // ============================================================
    // CANCEL APPOINTMENT - PATIENT
    // ============================================================

    @Transactional
    public AppointmentResponseDto cancelAppointment(
            Long appointmentId,
            Long userId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        // Only the patient who owns the appointment can cancel it
        if (!appointment.getPatient()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to cancel this appointment"
            );
        }

        // Prevent cancelling completed appointment
        if (appointment.getStatus()
                == AppointmentStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed appointment cannot be cancelled"
            );
        }

        // Prevent cancelling already cancelled appointment
        if (appointment.getStatus()
                == AppointmentStatus.CANCELLED) {

            throw new RuntimeException(
                    "Appointment is already cancelled"
            );
        }

        appointment.setStatus(
                AppointmentStatus.CANCELLED
        );

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);
        notificationService.createNotification(
                appointment.getDoctor().getId(),
                "Appointment Cancelled",
                "Patient "
                        + appointment.getPatient().getUser().getName()
                        + " has cancelled the appointment scheduled for "
                        + appointment.getAppointmentDate()
                        + " at "
                        + appointment.getAppointmentTime()
                        + ".",
                NotificationType.APPOINTMENT
        );


        return mapToResponseDto(updatedAppointment);
    }

    // ============================================================
    // CONFIRM APPOINTMENT - DOCTOR
    // ============================================================
    @Transactional
    public AppointmentResponseDto confirmAppointment(
            Long appointmentId,
            Long doctorUserId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        // Only assigned doctor can confirm
        if (!appointment.getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to confirm this appointment"
            );
        }

        // Doctor must be verified
        if (appointment.getDoctor()
                .getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Only a verified doctor can confirm appointments"
            );
        }

        if (appointment.getStatus()
                != AppointmentStatus.REQUESTED) {

            throw new RuntimeException(
                    "Only requested appointments can be confirmed"
            );
        }

        appointment.setStatus(
                AppointmentStatus.CONFIRMED
        );

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);
        notificationService.createNotification(
                appointment.getPatient().getId(),
                "Appointment Confirmed",
                "Your appointment with Dr. "
                        + appointment.getDoctor().getUser().getName()
                        + " on "
                        + appointment.getAppointmentDate()
                        + " at "
                        + appointment.getAppointmentTime()
                        + " has been confirmed.",
                NotificationType.APPOINTMENT
        );


        return mapToResponseDto(updatedAppointment);
    }

    // ============================================================
    // COMPLETE APPOINTMENT - DOCTOR
    // ============================================================
    @Transactional
    public AppointmentResponseDto completeAppointment(
            Long appointmentId,
            Long doctorUserId
    ) {

        Appointment appointment =
                appointmentRepository
                        .findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found"
                                )
                        );

        // Only assigned doctor can complete
        if (!appointment.getDoctor()
                .getId()
                .equals(doctorUserId)) {

            throw new RuntimeException(
                    "You are not allowed to complete this appointment"
            );
        }

        // Doctor must be verified
        if (appointment.getDoctor()
                .getVerificationStatus()
                != VerificationStatus.VERIFIED) {

            throw new RuntimeException(
                    "Only a verified doctor can complete appointments"
            );
        }

        if (appointment.getStatus()
                != AppointmentStatus.CONFIRMED) {

            throw new RuntimeException(
                    "Only confirmed appointments can be completed"
            );
        }

        appointment.setStatus(
                AppointmentStatus.COMPLETED
        );

        Appointment updatedAppointment =
                appointmentRepository.save(appointment);

        notificationService.createNotification(
                appointment.getPatient().getId(),
                "Appointment Completed",
                "Your appointment with Dr. "
                        + appointment.getDoctor().getUser().getName()
                        + " has been completed.",
                NotificationType.APPOINTMENT
        );

        return mapToResponseDto(updatedAppointment);
    }

    // ============================================================
    // ENTITY → RESPONSE DTO
    // ============================================================

    private AppointmentResponseDto mapToResponseDto(
            Appointment appointment
    ) {

        return AppointmentResponseDto.builder()

                .id(
                        appointment.getId()
                )

                .patientId(
                        appointment.getPatient().getId()
                )

                .patientName(
                        appointment.getPatient()
                                .getUser()
                                .getName()
                )

                .doctorId(
                        appointment.getDoctor().getId()
                )

                .doctorName(
                        appointment.getDoctor()
                                .getUser()
                                .getName()
                )

                .specialization(
                        appointment.getDoctor()
                                .getSpecialization()
                )

                .appointmentDate(
                        appointment.getAppointmentDate()
                )

                .appointmentTime(
                        appointment.getAppointmentTime()
                )

                .status(
                        appointment.getStatus()
                )

                .reason(
                        appointment.getReason()
                )

                .createdAt(
                        appointment.getCreatedAt()
                )

                .updatedAt(
                        appointment.getUpdatedAt()
                )

                .build();
    }
}