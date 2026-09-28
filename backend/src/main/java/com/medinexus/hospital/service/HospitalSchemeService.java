package com.medinexus.hospital.service;

import com.medinexus.hospital.dto.HospitalSchemeResponse;
import com.medinexus.hospital.entity.HospitalScheme;
import com.medinexus.hospital.repository.HospitalSchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalSchemeService {

    private final HospitalSchemeRepository hospitalSchemeRepository;

    public List<HospitalSchemeResponse> getActiveSchemes() {

        return hospitalSchemeRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public HospitalSchemeResponse getSchemeById(Long id) {

        HospitalScheme scheme = hospitalSchemeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Hospital scheme not found"));

        return mapToResponse(scheme);
    }

    private HospitalSchemeResponse mapToResponse(HospitalScheme scheme) {

        return HospitalSchemeResponse.builder()
                .id(scheme.getId())
                .name(scheme.getName())
                .description(scheme.getDescription())
                .provider(scheme.getProvider())
                .category(scheme.getCategory())
                .officialUrl(scheme.getOfficialUrl())
                .active(scheme.getActive())
                .build();
    }
}