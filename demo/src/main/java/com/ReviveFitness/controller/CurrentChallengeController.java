package com.ReviveFitness.controller;

import com.ReviveFitness.model.CurrentChallenge;
import com.ReviveFitness.service.CurrentChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/current-challenges")
public class CurrentChallengeController {

    @Autowired
    private CurrentChallengeService currentChallengeService;

    // Get all challenges
    @GetMapping("/all")
    public ResponseEntity<List<CurrentChallenge>> getAllChallenges() {
        List<CurrentChallenge> challenges = currentChallengeService.getAllChallenges();
        return ResponseEntity.ok(challenges);
    }

    // Get the current/active challenge
    @GetMapping
    public ResponseEntity<CurrentChallenge> getCurrentChallenge() {
        CurrentChallenge challenge = currentChallengeService.getOrCreateCurrentChallenge();
        return ResponseEntity.ok(challenge);
    }

    // Create new challenge
    @PostMapping
    public ResponseEntity<CurrentChallenge> createChallenge(@RequestBody CurrentChallenge challenge) {
        CurrentChallenge created = currentChallengeService.createChallenge(challenge);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Update challenge
    @PutMapping("/{id}")
    public ResponseEntity<CurrentChallenge> updateChallenge(
            @PathVariable Long id, 
            @RequestBody CurrentChallenge updatedChallenge) {
        try {
            CurrentChallenge result = currentChallengeService.updateChallenge(id, updatedChallenge);
            return ResponseEntity.ok(result);
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

    // Set a challenge as the current/active one
    @PutMapping("/{id}/set-current")
    public ResponseEntity<CurrentChallenge> setAsCurrentChallenge(@PathVariable Long id) {
        try {
            CurrentChallenge current = currentChallengeService.setAsCurrentChallenge(id);
            return ResponseEntity.ok(current);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}