package com.ReviveFitness.controller;

import com.ReviveFitness.dto.CurrentChallengeDTO;
import com.ReviveFitness.model.CurrentChallenge;
import com.ReviveFitness.service.CurrentChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/current-challenges")
public class CurrentChallengeController {

    @Autowired
    private CurrentChallengeService currentChallengeService;

    // Get all challenges as DTOs
    @GetMapping("/all")
    public ResponseEntity<List<CurrentChallengeDTO>> getAllChallenges() {
        List<CurrentChallengeDTO> dtos = currentChallengeService.getAllChallenges()
            .stream()
            .map(c -> new CurrentChallengeDTO(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.getImageUrl()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get the current/active challenge as DTO
    @GetMapping
    public ResponseEntity<CurrentChallengeDTO> getCurrentChallenge() {
        CurrentChallenge challenge = currentChallengeService.getOrCreateCurrentChallenge();
        CurrentChallengeDTO dto = new CurrentChallengeDTO(
            challenge.getId(),
            challenge.getTitle(),
            challenge.getDescription(),
            challenge.getImageUrl()
        );
        return ResponseEntity.ok(dto);
    }

    // Create new challenge (returns DTO)
    @PostMapping
    public ResponseEntity<CurrentChallengeDTO> createChallenge(@RequestBody CurrentChallenge challenge) {
        CurrentChallenge created = currentChallengeService.createChallenge(challenge);
        CurrentChallengeDTO dto = new CurrentChallengeDTO(
            created.getId(),
            created.getTitle(),
            created.getDescription(),
            created.getImageUrl()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    // Update challenge (returns DTO)
    @PutMapping("/{id}")
    public ResponseEntity<CurrentChallengeDTO> updateChallenge(
            @PathVariable Long id,
            @RequestBody CurrentChallenge updatedChallenge) {
        try {
            CurrentChallenge result = currentChallengeService.updateChallenge(id, updatedChallenge);
            CurrentChallengeDTO dto = new CurrentChallengeDTO(
                result.getId(),
                result.getTitle(),
                result.getDescription(),
                result.getImageUrl()
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete challenge
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id) {
        try {
            currentChallengeService.deleteChallenge(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Set a challenge as the current/active one (returns DTO)
    @PutMapping("/{id}/set-current")
    public ResponseEntity<CurrentChallengeDTO> setAsCurrentChallenge(@PathVariable Long id) {
        try {
            CurrentChallenge current = currentChallengeService.setAsCurrentChallenge(id);
            CurrentChallengeDTO dto = new CurrentChallengeDTO(
                current.getId(),
                current.getTitle(),
                current.getDescription(),
                current.getImageUrl()
            );
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
