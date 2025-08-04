package com.ReviveFitness.service;

import com.ReviveFitness.model.CurrentChallenge;
import com.ReviveFitness.repository.CurrentChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CurrentChallengeService {

    @Autowired
    private CurrentChallengeRepository currentChallengeRepository;

    // Get all challenges
    public List<CurrentChallenge> getAllChallenges() {
        return currentChallengeRepository.findAll();
    }

    // Get the first challenge (current one)
    public CurrentChallenge getOrCreateCurrentChallenge() {
        List<CurrentChallenge> challenges = currentChallengeRepository.findAll();
        if (challenges.isEmpty()) {
            return createDefaultChallenge();
        }
        return challenges.get(0); // Return the first one as "current"
    }

    // Create new challenge
    public CurrentChallenge createChallenge(CurrentChallenge challenge) {
        return currentChallengeRepository.save(challenge);
    }

    // Update specific challenge
    public CurrentChallenge updateChallenge(Long id, CurrentChallenge updatedChallenge) {
        return currentChallengeRepository.findById(id)
            .map(existingChallenge -> {
                existingChallenge.setTitle(updatedChallenge.getTitle());
                existingChallenge.setDescription(updatedChallenge.getDescription());
                existingChallenge.setImageUrl(updatedChallenge.getImageUrl());
                return currentChallengeRepository.save(existingChallenge);
            })
            .orElseThrow(() -> new RuntimeException("Challenge not found with id: " + id));
    }

    // Delete challenge
    public void deleteChallenge(Long id) {
        if (!currentChallengeRepository.existsById(id)) {
            throw new RuntimeException("Challenge not found with id: " + id);
        }
        currentChallengeRepository.deleteById(id);
    }

    // Set a specific challenge as the current one (for future enhancement)
    public CurrentChallenge setAsCurrentChallenge(Long id) {
        Optional<CurrentChallenge> challenge = currentChallengeRepository.findById(id);
        if (challenge.isPresent()) {
            // In a real app, you might add an "isActive" field to mark the current challenge
            return challenge.get();
        }
        throw new RuntimeException("Challenge not found with id: " + id);
    }

    // Helper method to create a default challenge
    private CurrentChallenge createDefaultChallenge() {
        CurrentChallenge defaultChallenge = new CurrentChallenge();
        defaultChallenge.setTitle("90-Day Transformation");
        defaultChallenge.setDescription("Ready to transform your body? Join our 90-day challenge!");
        defaultChallenge.setImageUrl("https://images.unsplash.com/photo-1534438327276-14e5300c3a48");
        return currentChallengeRepository.save(defaultChallenge);
    }
}