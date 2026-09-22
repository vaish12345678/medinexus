package com.medinexus.doctor.service;

import com.medinexus.doctor.dto.DoctorAvailabilityRequestDto;
import com.medinexus.doctor.dto.DoctorAvailabilityResponseDto;
import com.medinexus.doctor.entity.DoctorAvailability;
import com.medinexus.doctor.repository.DoctorAvailabilityRepository;
import com.medinexus.user.entity.DoctorProfile;
import com.medinexus.user.repository.DoctorProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepository;
    private final DoctorProfileRepository doctorProfileRepository;

    public DoctorAvailabilityService(
            DoctorAvailabilityRepository availabilityRepository,
            DoctorProfileRepository doctorProfileRepository) {

        this.availabilityRepository = availabilityRepository;
        this.doctorProfileRepository = doctorProfileRepository;
    }

    @Transactional
    public DoctorAvailabilityResponseDto addAvailability(
            Long doctorId,
            DoctorAvailabilityRequestDto dto) {

        DoctorProfile doctor = doctorProfileRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor profile not found"));

        if (!dto.getStartTime().isBefore(dto.getEndTime())) {
            throw new RuntimeException(
                    "Start time must be before end time");
        }

        DoctorAvailability availability = DoctorAvailability.builder()
                .doctor(doctor)
                .dayOfWeek(dto.getDayOfWeek())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .active(true)
                .build();

        DoctorAvailability saved =
                availabilityRepository.save(availability);

        return mapToResponse(saved);
    }

    public List<DoctorAvailabilityResponseDto> getMyAvailability(
            Long doctorId) {

        return availabilityRepository
                .findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public void deleteAvailability(
            Long doctorId,
            Long availabilityId) {

        DoctorAvailability availability =
                availabilityRepository.findById(availabilityId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Availability not found"));

        if (!availability.getDoctor().getId().equals(doctorId)) {
            throw new RuntimeException(
                    "You cannot delete another doctor's availability");
        }

        availabilityRepository.delete(availability);
    }

    private DoctorAvailabilityResponseDto mapToResponse(
            DoctorAvailability availability) {

        return DoctorAvailabilityResponseDto.builder()
                .id(availability.getId())
                .doctorId(availability.getDoctor().getId())
                .dayOfWeek(availability.getDayOfWeek())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .active(availability.getActive())
                .build();
    }
}