package com.medinexus.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medinexus.dto.GeminiSymptomResponseDto;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Schema;
import com.google.genai.types.Type;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.5-flash}")
    private String model;

    private final ObjectMapper objectMapper;

    public GeminiSymptomResponseDto analyzeSymptoms(String symptoms) {

        Client client = Client.builder()
                .apiKey(apiKey)
                .build();

        String prompt = """
                You are a healthcare symptom guidance assistant
                for a healthcare application called Medinexus.

                Analyze the symptoms provided by the patient and suggest
                the most relevant medical specialization.

                IMPORTANT RULES:

                1. Do NOT diagnose the patient.
                2. Do NOT claim that the patient has a specific disease.
                3. Only suggest an appropriate medical specialization.
                4. Give a short, clear explanation.
                5. If symptoms may indicate an emergency, clearly tell
                   the patient to seek urgent medical attention.
                6. Do not prescribe medicines.
                7. Do not recommend medication dosages.
                8. Return ONLY the requested JSON structure.

                Possible specializations include:
                Cardiology, Neurology, Dermatology, Orthopedics,
                Gastroenterology, Pulmonology, ENT, Ophthalmology,
                Gynecology, Urology, Psychiatry, General Medicine,
                Pediatrics, Dentistry and other appropriate specialties.

                Patient symptoms:
                %s
                """.formatted(symptoms);

        Schema responseSchema = Schema.builder()
                .type(Type.Known.OBJECT)
                .properties(Map.of(
                        "recommendedSpecialization",
                        Schema.builder()
                                .type(Type.Known.STRING)
                                .description(
                                        "The medical specialization most appropriate for evaluating these symptoms."
                                )
                                .build(),

                        "response",
                        Schema.builder()
                                .type(Type.Known.STRING)
                                .description(
                                        "A short explanation for the patient. Do not provide a diagnosis or medication."
                                )
                                .build()
                ))
                .required(java.util.List.of(
                        "recommendedSpecialization",
                        "response"
                ))
                .build();

        GenerateContentConfig config =
                GenerateContentConfig.builder()
                        .responseMimeType("application/json")
                        .responseSchema(responseSchema)
                        .build();

        GenerateContentResponse response =
                client.models.generateContent(
                        model,
                        prompt,
                        config
                );

        String jsonResponse = response.text();

        if (jsonResponse == null || jsonResponse.isBlank()) {
            throw new RuntimeException(
                    "Gemini returned an empty response"
            );
        }

        try {
            return objectMapper.readValue(
                    jsonResponse,
                    GeminiSymptomResponseDto.class
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to parse Gemini response",
                    e
            );
        }
    }
}